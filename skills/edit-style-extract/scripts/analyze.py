#!/usr/bin/env python3
"""Craft-analysis pass for edit-style-extract.

Measures what frame sampling cannot: exact cut timestamps, clip-length
distribution, beat regularity, per-frame motion energy, color/exposure
statistics, and audio loudness. Emits JSON + a markdown summary.

Deliberately dependency-free beyond ffmpeg/ffprobe, which the `watch`
skill already requires.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import statistics
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

# Scene score above which we call it a hard cut. 0.4 is ffmpeg's own
# conventional threshold; dissolves and whip-pans land lower and are
# picked up separately by the motion curve.
CUT_THRESHOLD = 0.4

# Analysis is done on a downscaled copy — we need statistics, not pixels.
ANALYSIS_WIDTH = 320

# Clip-length buckets, in seconds. Upper bound exclusive.
LENGTH_BUCKETS = [
    ("staccato (<0.5s)", 0.0, 0.5),
    ("rapido (0.5-1s)", 0.5, 1.0),
    ("medio (1-2s)", 1.0, 2.0),
    ("sostenido (2-4s)", 2.0, 4.0),
    ("largo (4-8s)", 4.0, 8.0),
    ("contemplativo (>8s)", 8.0, math.inf),
]


class AnalyzeError(RuntimeError):
    pass


@dataclass
class FrameStat:
    t: float
    scene: float = 0.0
    yavg: float = 0.0
    ylow: float = 0.0
    yhigh: float = 0.0
    uavg: float = 128.0
    vavg: float = 128.0
    sat: float = 0.0
    y_diff: float = 0.0


@dataclass
class Analysis:
    source: str
    fmt: dict = field(default_factory=dict)
    cuts: list = field(default_factory=list)
    rhythm: dict = field(default_factory=dict)
    motion: dict = field(default_factory=dict)
    color: dict = field(default_factory=dict)
    audio: dict = field(default_factory=dict)
    warnings: list = field(default_factory=list)


# --------------------------------------------------------------------------
# ffprobe / format
# --------------------------------------------------------------------------

def probe(path: str) -> dict:
    cmd = [
        "ffprobe", "-v", "error", "-print_format", "json",
        "-show_format", "-show_streams", "--", path,
    ]
    out = subprocess.run(cmd, capture_output=True, text=True)
    if out.returncode != 0:
        raise AnalyzeError(f"ffprobe fallo:\n{out.stderr.strip()}")
    data = json.loads(out.stdout)

    video = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), None)
    audio = next((s for s in data.get("streams", []) if s.get("codec_type") == "audio"), None)
    if video is None:
        raise AnalyzeError("el archivo no tiene stream de video")

    duration = float(data.get("format", {}).get("duration") or video.get("duration") or 0.0)
    w, h = int(video.get("width", 0)), int(video.get("height", 0))
    fps = _parse_rate(video.get("avg_frame_rate") or video.get("r_frame_rate") or "0/1")

    # MP4s carry a non-zero video start_time surprisingly often (AAC priming
    # delay, edit lists). Every pts ffmpeg reports is shifted by it, so we
    # record it once and subtract it everywhere — otherwise every cut
    # timestamp lands a fraction late and snaps to the wrong frame.
    try:
        start_time = float(video.get("start_time") or 0.0)
    except (TypeError, ValueError):
        start_time = 0.0

    return {
        "duration_s": round(duration, 3),
        "start_time_s": round(start_time, 6),
        "width": w,
        "height": h,
        "aspect": _aspect_label(w, h),
        "fps": round(fps, 3),
        "video_codec": video.get("codec_name"),
        "audio_codec": audio.get("codec_name") if audio else None,
        "has_audio": audio is not None,
        "bitrate_kbps": _kbps(data.get("format", {}).get("bit_rate")),
    }


def _parse_rate(rate: str) -> float:
    try:
        num, _, den = rate.partition("/")
        den_f = float(den or 1)
        return float(num) / den_f if den_f else 0.0
    except (TypeError, ValueError):
        return 0.0


def _kbps(bit_rate) -> float | None:
    try:
        return round(float(bit_rate) / 1000, 1)
    except (TypeError, ValueError):
        return None


def _aspect_label(w: int, h: int) -> str:
    if not w or not h:
        return "desconocido"
    ratio = w / h
    known = {
        "9:16": 9 / 16, "4:5": 4 / 5, "1:1": 1.0, "16:9": 16 / 9,
        "2.39:1": 2.39, "1.85:1": 1.85, "4:3": 4 / 3,
    }
    label, _ = min(known.items(), key=lambda kv: abs(kv[1] - ratio))
    if abs(known[label] - ratio) > 0.06:
        return f"{ratio:.2f}:1 (atipico)"
    return label


# --------------------------------------------------------------------------
# Frame pass: scene score + signalstats in one decode
# --------------------------------------------------------------------------

_META_RE = re.compile(r"lavfi\.(?:signalstats\.)?([A-Za-z_]+)=(-?[\d.]+)")
_PTS_RE = re.compile(r"pts_time:(-?[\d.]+)")


def frame_pass(path: str, sample_fps: float | None) -> list[FrameStat]:
    chain = [f"scale={ANALYSIS_WIDTH}:-2"]
    if sample_fps:
        chain.insert(0, f"fps={sample_fps}")
    chain += ["signalstats", r"select='gte(scene\,0)'", "metadata=print:file=-"]

    cmd = [
        "ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error",
        "-i", path, "-an", "-filter:v", ",".join(chain),
        "-f", "null", "-",
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    frames: list[FrameStat] = []
    current: FrameStat | None = None
    assert proc.stdout is not None
    for line in proc.stdout:
        m = _PTS_RE.search(line)
        if m:
            if current is not None:
                frames.append(current)
            current = FrameStat(t=float(m.group(1)))
            continue
        if current is None:
            continue
        km = _META_RE.search(line)
        if not km:
            continue
        key, val = km.group(1).upper(), float(km.group(2))
        if key == "SCENE_SCORE":
            current.scene = val
        elif key == "YAVG":
            current.yavg = val
        elif key == "YLOW":
            current.ylow = val
        elif key == "YHIGH":
            current.yhigh = val
        elif key == "UAVG":
            current.uavg = val
        elif key == "VAVG":
            current.vavg = val
        elif key == "YDIF":
            current.y_diff = val
    if current is not None:
        frames.append(current)

    proc.wait()
    if proc.returncode != 0:
        err = proc.stderr.read() if proc.stderr else ""
        raise AnalyzeError(f"ffmpeg (frame pass) fallo:\n{err.strip()}")
    if not frames:
        raise AnalyzeError("el frame pass no devolvio ningun frame")

    for f in frames:
        f.sat = math.hypot(f.uavg - 128.0, f.vavg - 128.0)
    return frames


# --------------------------------------------------------------------------
# Derived metrics
# --------------------------------------------------------------------------

def find_cuts(frames: list[FrameStat], threshold: float) -> list[float]:
    cuts = []
    for i, f in enumerate(frames):
        if i == 0:
            continue
        if f.scene >= threshold:
            # Collapse cuts that land on adjacent frames (one transition,
            # not two) — keeps ACL honest on flash transitions.
            if cuts and (f.t - cuts[-1]) < 0.08:
                continue
            cuts.append(round(f.t, 3))
    return cuts


def snap_to_frames(cuts: list[float], fps: float) -> tuple[list[float], list[int]]:
    """Quantize cut times onto the frame grid.

    Scene detection reports the pts of the first frame of the new shot,
    which can sit a fraction off the true grid on concatenated or VFR
    sources. FCP cuts on frame boundaries, so snapping here is what makes
    the profile directly executable instead of approximately right.
    """
    if not fps:
        return cuts, []
    frames = [max(0, round(t * fps)) for t in cuts]
    return [round(n / fps, 4) for n in frames], frames


def rhythm_metrics(cuts: list[float], duration: float) -> dict:
    if len(cuts) < 2:
        return {
            "cut_count": len(cuts),
            "cuts_per_min": round(len(cuts) / duration * 60, 1) if duration else 0.0,
            "cut_times_s": cuts,
            "note": "muy pocos cortes para medir ritmo — plano sostenido o corte por disolvencia",
        }

    boundaries = [0.0] + cuts + [duration]
    lengths = [round(b - a, 3) for a, b in zip(boundaries, boundaries[1:]) if b > a]

    hist = {}
    for label, lo, hi in LENGTH_BUCKETS:
        hist[label] = sum(1 for L in lengths if lo <= L < hi)

    mean = statistics.fmean(lengths)
    median = statistics.median(lengths)
    stdev = statistics.pstdev(lengths) if len(lengths) > 1 else 0.0
    cv = stdev / mean if mean else 0.0

    intervals = [round(b - a, 3) for a, b in zip(cuts, cuts[1:])]
    beat = _beat_regularity(intervals)

    return {
        "cut_count": len(cuts),
        "cuts_per_min": round(len(cuts) / duration * 60, 1) if duration else 0.0,
        "acl_s": round(mean, 3),
        "median_clip_s": round(median, 3),
        "shortest_clip_s": round(min(lengths), 3),
        "longest_clip_s": round(max(lengths), 3),
        "stdev_s": round(stdev, 3),
        "coef_variacion": round(cv, 3),
        "regularidad": (
            "metronomico" if cv < 0.35 else
            "consistente" if cv < 0.7 else
            "variable" if cv < 1.2 else "caotico/dinamico"
        ),
        "histograma": hist,
        "beat": beat,
        "cut_times_s": cuts,
    }


def _beat_regularity(intervals: list[float]) -> dict:
    """Detect whether cuts land on a musical grid.

    Tries candidate BPMs and scores how well cut intervals snap to whole
    or half beats. A high score means the edit is music-driven, which is
    the single most useful thing to know before rebuilding a rhythm.
    """
    if len(intervals) < 4:
        return {"detected": False, "reason": "muy pocos intervalos"}

    # Whole-beat hits score full, half-beat hits score partial. Without this
    # weighting a 120 BPM edit also scores perfectly at 60 BPM (every cut
    # reads as a half-beat), and the lower candidate wins the scan first.
    WHOLE, HALF = 1.0, 0.55
    TOL = 0.08

    # Each hit is weighted by how precisely it lands, decaying to zero at the
    # tolerance edge. A flat in-or-out test lets neighbouring BPMs tie with the
    # true one (a 120 BPM edit also "fits" 111 BPM within 8%), and the scan
    # then returns whichever it reached first.
    best = {"bpm": None, "score": 0.0, "beat_s": None}
    for bpm in range(60, 181):
        beat_s = 60.0 / bpm
        total = 0.0
        for iv in intervals:
            beats = iv / beat_s
            whole = round(beats)
            if whole >= 1:
                err = abs(beats - whole) / whole
                if err < TOL:
                    total += WHOLE * (1.0 - err / TOL)
                    continue
            half = round(beats * 2) / 2
            if half > 0:
                err = abs(beats - half) / half
                if err < TOL:
                    total += HALF * (1.0 - err / TOL)
        score = total / len(intervals)
        if score > best["score"]:
            best = {"bpm": bpm, "score": round(score, 3), "beat_s": round(beat_s, 4)}

    # A grid is only meaningful when most cuts obey it.
    if best["score"] >= 0.6:
        return {
            "detected": True,
            "bpm_estimado": best["bpm"],
            "beat_s": best["beat_s"],
            "cortes_en_grid_pct": round(best["score"] * 100, 1),
            "nota": "edicion dirigida por musica — reconstruir con beat_sync_blade, no a mano",
        }
    return {
        "detected": False,
        "mejor_bpm_candidato": best["bpm"],
        "cortes_en_grid_pct": round(best["score"] * 100, 1),
        "nota": "cortes dirigidos por contenido/narrativa, no por beat",
    }


def motion_metrics(frames: list[FrameStat], cuts: list[float], duration: float) -> dict:
    """Motion energy from YDIF — mean absolute luma change vs the previous frame.

    Scene score is deliberately NOT used here. It compares histograms, so it
    answers "did the shot change?", not "how much is moving?". Measured on
    reference clips: pure random noise (the theoretical maximum of pixel
    change) scores 0.006 on scene score but 33.8 on YDIF, while a violent
    pan scores 0.035 and 19.6 respectively — scene score ranks them
    backwards. YDIF orders them correctly.

    Frames at cuts are excluded; a cut spikes YDIF and would otherwise read
    as camera movement.
    """
    cut_set = {round(c, 2) for c in cuts}
    intra = [f for f in frames[1:] if round(f.t, 2) not in cut_set and f.scene < CUT_THRESHOLD]
    if not intra:
        return {"note": "sin datos de movimiento"}

    ydif = [f.y_diff for f in intra]
    mean = statistics.fmean(ydif)
    p90 = _percentile(ydif, 0.9)

    # Segment the timeline into blocks to see where the energy lives.
    blocks = 10 if duration > 20 else 4
    block_len = duration / blocks if duration else 0
    curve = []
    if block_len:
        for b in range(blocks):
            lo, hi = b * block_len, (b + 1) * block_len
            vals = [f.y_diff for f in intra if lo <= f.t < hi]
            curve.append({
                "desde_s": round(lo, 2),
                "hasta_s": round(hi, 2),
                "energia": round(statistics.fmean(vals), 3) if vals else 0.0,
            })

    # Thresholds anchored on measured reference clips (0-255 luma scale).
    if mean < 1.0:
        label = "estatico (camara fija / graficos quietos)"
    elif mean < 4.0:
        label = "sutil (deriva lenta, push-in, parallax)"
    elif mean < 12.0:
        label = "activo (handheld, paneos, motion graphics)"
    else:
        label = "agresivo (whip pans, zooms rapidos, camara en mano fuerte)"

    # Scene score kept as a separate signal: how much the FRAMING/composition
    # shifts, which is what surfaces slow dissolves and match cuts.
    comp = statistics.fmean(f.scene for f in intra)

    return {
        "energia_media": round(mean, 3),
        "energia_p90": round(p90, 3),
        "metrica": "YDIF (diferencia media de luma vs frame anterior, escala 0-255)",
        "clasificacion": label,
        "cambio_composicion": round(comp, 5),
        "curva_por_bloque": curve,
    }


def color_metrics(frames: list[FrameStat]) -> dict:
    y = [f.yavg for f in frames]
    sat = [f.sat for f in frames]
    u = statistics.fmean(f.uavg for f in frames)
    v = statistics.fmean(f.vavg for f in frames)
    low = statistics.fmean(f.ylow for f in frames)
    high = statistics.fmean(f.yhigh for f in frames)

    y_mean = statistics.fmean(y)
    sat_mean = statistics.fmean(sat)

    # U above neutral = blue-leaning; V above neutral = red-leaning.
    warmth = (v - 128.0) - (u - 128.0)

    return {
        "luma_media_0_255": round(y_mean, 1),
        "exposicion": (
            "oscuro / low-key" if y_mean < 70 else
            "medio-bajo" if y_mean < 100 else
            "balanceado" if y_mean < 150 else
            "luminoso / high-key" if y_mean < 190 else "sobreexpuesto / blown"
        ),
        "negro_medio": round(low, 1),
        "blanco_medio": round(high, 1),
        "rango_dinamico": round(high - low, 1),
        "contraste": (
            "plano / filmico lavado" if (high - low) < 120 else
            "moderado" if (high - low) < 190 else "alto / punchy"
        ),
        "saturacion_media": round(sat_mean, 2),
        "saturacion": (
            "desaturado / monocromo" if sat_mean < 8 else
            "contenido" if sat_mean < 18 else
            "natural" if sat_mean < 30 else "saturado / pop"
        ),
        "u_avg": round(u, 1),
        "v_avg": round(v, 1),
        "temperatura": (
            "frio / azulado" if warmth < -3 else
            "neutro" if warmth < 3 else
            "calido / ambar" if warmth < 10 else "muy calido / dorado"
        ),
        "indice_calidez": round(warmth, 2),
        "estabilidad_luma": round(statistics.pstdev(y), 2) if len(y) > 1 else 0.0,
    }


_EBUR_RE = re.compile(r"I:\s*(-?[\d.]+)\s*LUFS")
_LRA_RE = re.compile(r"LRA:\s*(-?[\d.]+)\s*LU")
_PEAK_RE = re.compile(r"Peak:\s*(-?[\d.]+)\s*dBFS")
_MOMENT_RE = re.compile(r"t:\s*([\d.]+)\s+.*?M:\s*(-?[\d.]+)")


def audio_metrics(path: str, duration: float) -> dict:
    cmd = [
        "ffmpeg", "-nostdin", "-hide_banner", "-i", path,
        "-af", "ebur128=peak=true", "-f", "null", "-",
    ]
    out = subprocess.run(cmd, capture_output=True, text=True)
    text = out.stderr or ""
    if out.returncode != 0 and "ebur128" not in text:
        return {"error": "no se pudo analizar el audio", "detalle": text.strip()[-400:]}

    summary_tail = text[text.rfind("Summary") :] if "Summary" in text else text
    integrated = _EBUR_RE.search(summary_tail)
    lra = _LRA_RE.search(summary_tail)
    peak = _PEAK_RE.search(summary_tail)

    moments = [(float(t), float(m)) for t, m in _MOMENT_RE.findall(text) if float(m) > -70]
    curve = []
    if moments and duration:
        blocks = 10 if duration > 20 else 4
        block_len = duration / blocks
        for b in range(blocks):
            lo, hi = b * block_len, (b + 1) * block_len
            vals = [m for t, m in moments if lo <= t < hi]
            curve.append({
                "desde_s": round(lo, 2),
                "hasta_s": round(hi, 2),
                "lufs_m": round(statistics.fmean(vals), 1) if vals else None,
            })

    result = {
        "lufs_integrado": float(integrated.group(1)) if integrated else None,
        "rango_loudness_lu": float(lra.group(1)) if lra else None,
        "true_peak_dbfs": float(peak.group(1)) if peak else None,
        "curva_loudness": curve,
    }
    if result["lufs_integrado"] is not None:
        i = result["lufs_integrado"]
        result["mastering"] = (
            "muy comprimido / social-loud" if i > -12 else
            "estandar de redes (-14 LUFS)" if i > -16 else
            "broadcast / cinematico" if i > -22 else "muy dinamico / silencioso"
        )
    return result


def _percentile(values: list[float], q: float) -> float:
    if not values:
        return 0.0
    s = sorted(values)
    k = (len(s) - 1) * q
    lo, hi = math.floor(k), math.ceil(k)
    if lo == hi:
        return s[int(k)]
    return s[lo] * (hi - k) + s[hi] * (k - lo)


# --------------------------------------------------------------------------
# Report
# --------------------------------------------------------------------------

def render_markdown(a: Analysis) -> str:
    f, r, m, c, au = a.fmt, a.rhythm, a.motion, a.color, a.audio
    L = []
    L.append("# Analisis de craft\n")
    L.append(f"**Fuente:** `{a.source}`\n")
    for w in a.warnings:
        L.append(f"> AVISO: {w}\n")

    L.append("## Formato")
    L.append(f"- {f['width']}x{f['height']} ({f['aspect']}) @ {f['fps']} fps · {f['duration_s']}s")
    L.append(f"- codecs: {f['video_codec']} / {f['audio_codec'] or 'sin audio'}\n")

    L.append("## Ritmo de cortes")
    if r.get("cut_count", 0) < 2:
        L.append(f"- {r.get('note', '')}")
        if r.get("cut_times_s"):
            L.append(f"- corte(s) detectado(s) en: {r['cut_times_s']}")
        L.append("")
    else:
        L.append(f"- **{r['cut_count']} cortes** · {r['cuts_per_min']}/min")
        L.append(f"- **ACL {r['acl_s']}s** · mediana {r['median_clip_s']}s · rango {r['shortest_clip_s']}s-{r['longest_clip_s']}s")
        L.append(f"- variacion: {r['coef_variacion']} → **{r['regularidad']}**")
        L.append("- distribucion: " + " · ".join(f"{k} {v}" for k, v in r["histograma"].items() if v))
        b = r["beat"]
        if b.get("detected"):
            L.append(f"- **BEAT-DRIVEN**: ~{b['bpm_estimado']} BPM, {b['cortes_en_grid_pct']}% de cortes en grid ({b['beat_s']}s/beat)")
        elif b.get("reason"):
            L.append(f"- sincronia a beat: no medible ({b['reason']})")
        else:
            L.append(f"- no sincronizado a beat ({b.get('cortes_en_grid_pct', 0)}% en grid) — cortes narrativos")
        L.append("")

    L.append("## Movimiento")
    L.append(f"- energia media {m.get('energia_media', 0)} → **{m.get('clasificacion', 'n/d')}**")
    if m.get("curva_por_bloque"):
        peak_block = max(m["curva_por_bloque"], key=lambda b: b["energia"])
        L.append(f"- pico de energia en {peak_block['desde_s']}s-{peak_block['hasta_s']}s ({peak_block['energia']})")
    L.append("")

    L.append("## Color y luz")
    L.append(f"- exposicion: **{c['exposicion']}** (luma {c['luma_media_0_255']}/255)")
    L.append(f"- contraste: **{c['contraste']}** (negros {c['negro_medio']} → blancos {c['blanco_medio']})")
    L.append(f"- saturacion: **{c['saturacion']}** ({c['saturacion_media']})")
    L.append(f"- temperatura: **{c['temperatura']}** (indice {c['indice_calidez']})")
    L.append(f"- estabilidad de luma entre planos: {c['estabilidad_luma']} (bajo = grade consistente)\n")

    L.append("## Audio")
    if au.get("error"):
        L.append(f"- {au['error']}\n")
    elif au.get("lufs_integrado") is None:
        L.append("- sin pista de audio medible\n")
    else:
        L.append(f"- **{au['lufs_integrado']} LUFS** integrado · LRA {au['rango_loudness_lu']} LU · peak {au['true_peak_dbfs']} dBFS")
        L.append(f"- mastering: **{au.get('mastering', 'n/d')}**\n")

    L.append("---")
    L.append("Los timestamps exactos de corte estan en el JSON (`rhythm.cut_times_s`).")
    L.append("Usalos con `watch.py --timestamps` para ver los frames de cada corte.")
    return "\n".join(L)


def main() -> int:
    ap = argparse.ArgumentParser(description="Analisis de craft para edit-style-extract")
    ap.add_argument("source", help="ruta a un archivo de video LOCAL (ya descargado)")
    ap.add_argument("--json-out", help="escribir el JSON completo aqui")
    ap.add_argument("--threshold", type=float, default=CUT_THRESHOLD,
                    help=f"umbral de scene score para contar un corte (default {CUT_THRESHOLD})")
    ap.add_argument("--sample-fps", type=float, default=None,
                    help="decimar antes de analizar (acelera videos largos; pierde precision de corte)")
    ap.add_argument("--no-audio", action="store_true", help="saltar el analisis de loudness")
    args = ap.parse_args()

    path = Path(args.source).expanduser()
    if not path.exists():
        print(f"ERROR: no existe {path}", file=sys.stderr)
        print("Este script solo acepta archivos locales. Descarga primero con watch.py.", file=sys.stderr)
        return 1
    src = str(path.resolve())

    a = Analysis(source=src)
    try:
        a.fmt = probe(src)
        duration = a.fmt["duration_s"]

        sample_fps = args.sample_fps
        if sample_fps is None and duration > 600:
            sample_fps = 10.0
            a.warnings.append(
                f"video de {duration/60:.1f} min — decimado a 10 fps para el analisis. "
                "Los timestamps de corte tienen +-0.1s de error. Usa --sample-fps 0 para precision total."
            )
        if sample_fps == 0:
            sample_fps = None

        frames = frame_pass(src, sample_fps)

        offset = a.fmt["start_time_s"]
        if offset:
            for fr in frames:
                fr.t = round(fr.t - offset, 6)

        raw_cuts = find_cuts(frames, args.threshold)
        a.cuts, cut_frames = snap_to_frames(raw_cuts, a.fmt["fps"])
        a.rhythm = rhythm_metrics(a.cuts, duration)
        a.rhythm["cut_frames"] = cut_frames
        a.rhythm["fps_referencia"] = a.fmt["fps"]
        a.motion = motion_metrics(frames, a.cuts, duration)
        a.color = color_metrics(frames)
        a.audio = (
            {"note": "omitido por --no-audio"} if args.no_audio
            else audio_metrics(src, duration) if a.fmt["has_audio"]
            else {"note": "el archivo no tiene pista de audio"}
        )
    except AnalyzeError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    payload = {
        "source": a.source, "format": a.fmt, "rhythm": a.rhythm,
        "motion": a.motion, "color": a.color, "audio": a.audio,
        "warnings": a.warnings,
    }
    if args.json_out:
        out = Path(args.json_out).expanduser()
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    print(render_markdown(a))
    if args.json_out:
        print(f"\nJSON: {Path(args.json_out).expanduser().resolve()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
