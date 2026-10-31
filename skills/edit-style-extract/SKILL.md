---
name: edit-style-extract
description: Extrae el ESTILO DE EDICION de un video de referencia (como esta hecho, no de que trata) y lo escribe como un Perfil de Estilo portable, ejecutable despues en Final Cut Pro via splicekit. Usar cuando el usuario pasa un video y quiere replicar su craft — tipografia, ritmo de cortes, intro, transiciones, color, sonido. Trigger explicito: /edit-style-extract
argument-hint: "<url-o-ruta-del-video> [que te gusto]"
allowed-tools: Bash, Read, AskUserQuestion, Write, Skill
user-invocable: true
---

# Extraer estilo de edicion

Esta skill responde **"¿como esta hecho este video?"** — no "¿de que trata?". Su salida no es un resumen: es un **Perfil de Estilo de Edicion**, un `.md` portable que se carga en otra conversacion para ejecutar la edicion.

Corre sobre dos motores:
- **`watch`** (skill hermana, ya instalada) — descarga, frames, transcript. Es el ojo.
- **`scripts/analyze.py`** (de esta skill) — cortes exactos, BPM, energia de movimiento, color, loudness. Es el cronometro.

Ninguno basta solo. Los frames van a 2 fps maximo, asi que **no puedes medir un corte de 8 frames mirando frames** — para eso esta el analyzer. Y el analyzer no ve tipografia ni composicion — para eso estan los frames.

## Regla que gobierna todo: separar medido de observado de inferido

Cada afirmacion del perfil lleva una etiqueta de confianza. Es lo que hace que el perfil sea utilizable sin re-verificar:

| Etiqueta | Significa | De donde sale |
|---|---|---|
| `[MEDIDO]` | Numero duro, reproducible | `analyze.py` |
| `[OBSERVADO]` | Lo vi en los frames | Lectura de imagenes |
| `[INFERIDO]` | Deduccion razonada, no verificada | Juicio propio |

**Nunca presentes un `[INFERIDO]` como si fuera `[MEDIDO]`.** Si no mediste el tamaño de una fuente, no inventes "48px" — escribe `[OBSERVADO] titulares muy grandes, ~1/8 de la altura del cuadro`.

## Resolver SKILL_DIR

Todo comando de abajo corre un script bajo `SKILL_DIR/scripts/`. `SKILL_DIR` es la ruta absoluta del directorio que contiene ESTE archivo (tu harness te la dio al leerlo). Normalmente:

```
SKILL_DIR=~/.claude/skills/edit-style-extract
WATCH_DIR=~/.claude/skills/watch
```

## Paso 0 — Preflight

```bash
python3 ~/.claude/skills/watch/scripts/setup.py --check
```

Exit 0 → seguir sin comentar. Si falla, ver el `SKILL.md` de `watch`.

**Esta maquina no necesita ninguna API key.** `analyze.py` solo usa `ffmpeg`/`ffprobe`, y la transcripcion corre en local con whisper.cpp (`large-v3-turbo`, auto-deteccion de idioma). Nada sale de la maquina.

## Paso 1 — Conseguir el archivo local

`analyze.py` **no descarga**. Necesita un archivo local. Si el usuario dio una URL, bajala primero y quedate con el `Work dir` que imprime el reporte:

```bash
python3 ~/.claude/skills/watch/scripts/watch.py "<url>" --detail transcript --out-dir /tmp/estilo-<slug>
```

`--detail transcript` baja el video y saca el transcript **sin gastar tokens en frames todavia**. El archivo queda en el work dir (`video.mp4` o similar). Localizalo:

```bash
ls -la /tmp/estilo-<slug>/
```

Si el usuario dio una ruta local, usala directo y salta este paso.

## Paso 2 — Analisis de craft (barato, hazlo siempre primero)

```bash
python3 ~/.claude/skills/edit-style-extract/scripts/analyze.py "<archivo-local>" \
  --json-out /tmp/estilo-<slug>/analysis.json
```

Esto imprime un reporte markdown y guarda el JSON. **Leelo antes de mirar un solo frame** — decide todo lo que sigue:

- `rhythm.cut_times_s` / `cut_frames` → los cortes reales, ya cuadrados a la reticula de frames
- `rhythm.beat.detected` → si es `true`, el montaje va por musica y se reconstruye con `beat_sync_blade`, no a mano
- `rhythm.acl_s` → duracion media de plano, el numero mas util de todos
- `motion.clasificacion` → estatico / sutil / activo / agresivo
- `color.*` → exposicion, contraste, saturacion, temperatura
- `audio.lufs_integrado` → estandar de mastering

Flags:
- `--threshold 0.25` — baja el umbral si sospechas cortes entre planos visualmente parecidos (ver Limitaciones)
- `--sample-fps 0` — precision total de corte en videos >10 min (lento)
- `--no-audio` — salta loudness

## Paso 3 — Frames, calibrados por formato

Aqui es donde se gastan los tokens. **Los parametros dependen del formato**, no los uses por default:

### Reel / Short vertical (15-60s)
Cada corte cuenta y el hook de los primeros 3s es el activo principal.

```bash
python3 ~/.claude/skills/watch/scripts/watch.py "<archivo>" \
  --detail token-burner --no-dedup --resolution 768
```

`--no-dedup` es **obligatorio**: el dedup existe para tirar frames repetidos, pero en analisis de craft los frames casi-iguales son justo la evidencia de movimiento sutil y de cuanto dura un texto en pantalla.

Ademas, pasada dedicada al hook:

```bash
python3 ~/.claude/skills/watch/scripts/watch.py "<archivo>" \
  --start 0 --end 3 --fps 2 --resolution 1024 --no-dedup
```

### Brand film (1-3 min)
Prioridad en grade, composicion y transiciones.

```bash
python3 ~/.claude/skills/watch/scripts/watch.py "<archivo>" \
  --detail balanced --no-dedup --resolution 768
```

### Contenido largo (+10 min)
**No escanees el video completo.** Toma 3 secciones representativas usando `cut_times_s` para elegir zonas de densidad distinta (una tranquila, una densa, una de transicion):

```bash
python3 ~/.claude/skills/watch/scripts/watch.py "<archivo>" --start 1:20 --end 1:50 --no-dedup
```

### Pasada tipografica (cuando el usuario menciona textos)
512px y 768px no dejan leer type con precision. Identifica en la pasada anterior los momentos con texto en pantalla y re-corre solo esos:

```bash
python3 ~/.claude/skills/watch/scripts/watch.py "<archivo>" \
  --detail transcript --timestamps 0:02,0:07,0:14,0:23 --resolution 1024
```

`--detail transcript --timestamps` devuelve **solo** esos frames. Es la forma barata de tener 1024px donde importa.

**Lee todos los frames en un solo mensaje** (llamadas `Read` en paralelo).

## Paso 4 — El dialogo (el paso que no se salta)

Aqui esta el corazon de la skill. **Tu no decides que estilo vale la pena robar — el usuario si.**

Despues de leer los frames, presenta un **menu de hallazgos**, no un ensayo. Un renglon por dimension, con el dato duro al frente:

```
Encontre esto:

1. TIPOGRAFIA — sans condensada en mayusculas, anclada abajo-izquierda, 3 palabras max por tarjeta
2. HOOK — primer corte al frame 14 (0.47s), texto antes que imagen
3. CORTES — ACL 0.62s, 120 BPM, 100% en grid → montaje por musica
4. MOVIMIENTO — push-in lento constante, ningun plano fijo
5. COLOR — low-key, negros levantados a 22, temperatura fria (-6)
6. SONIDO — -13 LUFS, musica sola, sin voz

¿Cual de estos quieres que se vuelva regla?
```

Usa `AskUserQuestion` con `multiSelect: true` para que el usuario marque las dimensiones que le importan. **Solo escribe al perfil lo que eligio.** Un perfil de 3 dimensiones que el usuario si quiere vale mas que uno de 7 donde 4 son ruido que despues contamina la ejecucion.

Si el usuario ya dijo que le gusto al invocar la skill ("me late como acomoda los textos"), salta el menu y profundiza solo en eso.

## Paso 5 — Escribir el perfil

Plantilla completa y reglas de escritura: **[references/profile-template.md](references/profile-template.md)** — leela antes de escribir.

Destino: `~/.claude/edit-styles/<slug>.md`

El slug describe el estilo, no el video fuente: `reel-corte-rapido-beat`, no `video-de-tiktok-1`. El perfil se va a reusar en videos que no tienen nada que ver con el original.

Si ya existe un perfil parecido, **preguntá si actualizar ese o crear uno nuevo**. Perfiles casi-duplicados son el modo de falla que hace inservible la biblioteca.

## Paso 6 — Limpieza

`rm -rf /tmp/estilo-<slug>` cuando el perfil este escrito. Contiene el video completo y los frames. Confirma antes si el usuario quiere seguir preguntando sobre ese video.

## Limitaciones reales (decirlas, no esconderlas)

- **Cortes entre planos visualmente parecidos no se detectan.** El scene detection se basa en cambio de pixel. Dos planos del mismo sujeto en el mismo encuadre leen como continuidad. Verificado: en un clip sintetico de 16 planos, umbral 0.4 detecto 12; bajando a 0.15 subio a 14, nunca 15. Si el ACL parece muy alto para lo que ves, re-corre con `--threshold 0.25` y dilo en el perfil.
- **Disolvencias y fundidos no cuentan como corte.** Aparecen como energia de movimiento sostenida, no como pico. Si el histograma dice pocos cortes pero la energia es alta, sospecha transiciones suaves y verificalo en los frames.
- **La energia de movimiento mide cambio de luma (YDIF), no vectores de movimiento.** Distingue bien camara fija / deriva lenta / paneo / whip pan, pero **no** distingue "la camara se movio" de "el sujeto se movio". Los umbrales estan calibrados contra clips de referencia medidos, no contra footage real de camara — tomalos como direccion, no como verdad absoluta. El campo aparte `cambio_composicion` (scene score) sube en disolvencias y match cuts, donde YDIF se queda bajo.
- **El BPM es estimado desde los intervalos de corte, no desde el audio.** Si el montaje no va a beat, el numero no significa nada — por eso `detected: false` es una respuesta valida y hay que respetarla.
- **El color se mide sobre el video comprimido y reescalado a 320px.** Sirve para direccion de grade (frio/calido, alto/bajo contraste), **no** para sacar valores de LUT. No escribas un numero de LUT en el perfil.
- **Un video de referencia es una muestra de n=1.** Si el usuario quiere el estilo de un canal, pide 2-3 videos y extrae lo que se repite. Lo que aparece una sola vez es decision de ese video, no estilo.

## Que NO hacer

- No escribas el perfil sin haber leido frames. El analyzer da numeros, no criterio.
- No inventes nombres de efectos ni transiciones de FCP. Se descubren en ejecucion con `list_effects` / `list_transitions`. El perfil describe la **intencion** ("corte duro, sin transicion, salvo un flash blanco de 4 frames en el cambio de bloque"), no un nombre de plugin que quiza no exista en esa instalacion.
- No metas contenido en el perfil. "Habla de zapatos" no es estilo. "Producto en pantalla antes del segundo 1" si.
- No mezcles dos videos de referencia en un solo perfil sin decirlo. Si lo haces, marca cada regla con su fuente.
