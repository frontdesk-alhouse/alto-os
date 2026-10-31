#!/usr/bin/env python3
"""Convierte un entregable HTML a Markdown preservando las tablas.

Por qué existe: `textutil -convert txt` aplana cada <td> a su propia línea y
destruye la relación columna-valor. Un censo competitivo queda como un chorro de
texto sin encabezados. Esto renderiza <table> como tabla de Markdown real.

Uso:
    python3 html2md.py entrada.html [-o salida.md]
    python3 html2md.py --dir "<carpeta>"     # todos los .html sin gemelo o desactualizados
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys
from html.parser import HTMLParser

# Tags que no cierran. Críticos: si cuentan para la profundidad de una región
# saltada (<head>, <style>, <svg>), el parser se queda atorado y devuelve vacío.
VOID = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}
SKIP = {"head", "style", "script", "svg", "noscript", "template"}
HEADINGS = {"h1": "#", "h2": "##", "h3": "###", "h4": "####", "h5": "#####", "h6": "######"}


class Html2Md(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.skip_depth = 0
        self.skip_tag: str | None = None
        # tabla
        self.table_depth = 0
        self.rows: list[list[str]] = []
        self.row: list[str] | None = None
        self.cell: list[str] | None = None
        self.header_row = False
        self.first_row_is_header = False
        # inline
        self.buf: list[str] = []
        self.list_stack: list[str] = []
        self.item_index: list[int] = []
        self.pre_depth = 0
        self.href: str | None = None

    # ---- destino del texto -------------------------------------------------
    def _emit(self, text: str) -> None:
        if self.cell is not None:
            self.cell.append(text)
        else:
            self.buf.append(text)

    def _flush(self) -> None:
        text = "".join(self.buf).strip()
        self.buf = []
        if text:
            self.out.append(text)

    # ---- tags --------------------------------------------------------------
    def handle_starttag(self, tag, attrs):
        if self.skip_depth:
            if tag == self.skip_tag and tag not in VOID:
                self.skip_depth += 1
            return
        if tag in SKIP:
            self.skip_tag, self.skip_depth = tag, 1
            return

        a = dict(attrs)
        if tag == "table":
            self._flush()
            self.table_depth += 1
            if self.table_depth == 1:
                self.rows, self.first_row_is_header = [], False
        elif tag == "tr" and self.table_depth:
            self.row, self.header_row = [], False
        elif tag in ("td", "th") and self.table_depth:
            self.cell = []
            if tag == "th":
                self.header_row = True
        elif tag in HEADINGS:
            self._flush()
            self.buf.append(HEADINGS[tag] + " ")
        elif tag in ("p", "div", "section", "article", "header", "footer", "main", "tfoot"):
            self._flush()
        elif tag == "br":
            self._emit("  \n" if self.cell is None else " ")
        elif tag == "hr":
            self._flush()
            self.out.append("---")
        elif tag in ("ul", "ol"):
            self._flush()
            self.list_stack.append(tag)
            self.item_index.append(0)
        elif tag == "li" and self.list_stack:
            self._flush()
            depth = len(self.list_stack) - 1
            if self.list_stack[-1] == "ol":
                self.item_index[-1] += 1
                marker = f"{self.item_index[-1]}."
            else:
                marker = "-"
            self.buf.append("  " * depth + marker + " ")
        elif tag in ("strong", "b"):
            self._emit("**")
        elif tag in ("em", "i"):
            self._emit("*")
        elif tag == "code" and not self.pre_depth:
            self._emit("`")
        elif tag == "pre":
            self._flush()
            self.pre_depth += 1
            self.buf.append("```\n")
        elif tag == "a":
            self.href = a.get("href")
            if self.href:
                self._emit("[")
        elif tag == "img":
            alt, src = a.get("alt", ""), a.get("src", "")
            self._emit(f"![{alt}]({src})")
        elif tag == "blockquote":
            self._flush()
            self.buf.append("> ")

    def handle_endtag(self, tag):
        if self.skip_depth:
            if tag == self.skip_tag:
                self.skip_depth -= 1
                if not self.skip_depth:
                    self.skip_tag = None
            return

        if tag == "table" and self.table_depth:
            self.table_depth -= 1
            if not self.table_depth:
                self._render_table()
        elif tag == "tr" and self.row is not None:
            if self.row:
                if not self.rows and self.header_row:
                    self.first_row_is_header = True
                self.rows.append(self.row)
            self.row = None
        elif tag in ("td", "th") and self.cell is not None:
            text = re.sub(r"\s+", " ", "".join(self.cell)).strip().replace("|", "\\|")
            if self.row is not None:
                self.row.append(text)
            self.cell = None
        elif tag in HEADINGS:
            self._flush()
        elif tag in ("p", "div", "section", "article", "header", "footer", "li", "blockquote"):
            self._flush()
        elif tag in ("ul", "ol"):
            self._flush()
            if self.list_stack:
                self.list_stack.pop()
                self.item_index.pop()
        elif tag in ("strong", "b"):
            self._emit("**")
        elif tag in ("em", "i"):
            self._emit("*")
        elif tag == "code" and not self.pre_depth:
            self._emit("`")
        elif tag == "pre" and self.pre_depth:
            self.pre_depth -= 1
            self.buf.append("\n```")
            self._flush()
        elif tag == "a" and self.href:
            self._emit(f"]({self.href})")
            self.href = None

    def handle_data(self, data):
        if self.skip_depth:
            return
        if self.pre_depth:
            self._emit(data)
            return
        text = re.sub(r"\s+", " ", data)
        if text.strip() or (self.buf and not self.buf[-1].endswith(" ")):
            self._emit(text)

    # ---- tabla -------------------------------------------------------------
    def _render_table(self) -> None:
        if not self.rows:
            return
        width = max(len(r) for r in self.rows)
        rows = [r + [""] * (width - len(r)) for r in self.rows]
        head = rows[0] if self.first_row_is_header else [""] * width
        body = rows[1:] if self.first_row_is_header else rows
        lines = ["| " + " | ".join(head) + " |",
                 "|" + "|".join([" --- "] * width) + "|"]
        lines += ["| " + " | ".join(r) + " |" for r in body]
        self.out.append("\n".join(lines))
        self.rows = []

    def result(self) -> str:
        self._flush()
        text = "\n\n".join(b for b in self.out if b.strip())
        return re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"


def convert(path: pathlib.Path) -> str:
    parser = Html2Md()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    parser.close()
    body = parser.result()
    title = path.stem.replace("-", " ").replace("_", " ")
    header = (
        f"<!-- Gemelo legible generado desde {path.name}. "
        f"El entregable real es el HTML; este .md existe para que un agente lo lea. -->\n\n"
    )
    if not body.lstrip().startswith("#"):
        header += f"# {title}\n\n"
    return header + body


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("archivo", nargs="?", type=pathlib.Path)
    ap.add_argument("-o", "--output", type=pathlib.Path)
    ap.add_argument("--dir", type=pathlib.Path, help="procesa todos los .html del árbol")
    ap.add_argument("--force", action="store_true", help="regenera aunque el gemelo esté al día")
    args = ap.parse_args()

    targets: list[pathlib.Path] = []
    if args.dir:
        targets = sorted(p for p in args.dir.rglob("*.html") if ".git" not in p.parts)
    elif args.archivo:
        targets = [args.archivo]
    else:
        ap.error("da un archivo o --dir")

    hechos = saltados = vacios = 0
    for src in targets:
        dst = args.output if (args.output and not args.dir) else src.with_suffix(".md")
        if dst.exists() and not args.force and dst.stat().st_mtime >= src.stat().st_mtime:
            saltados += 1
            continue
        if src.stat().st_size == 0:
            print(f"  0 bytes (¿desalojado de iCloud? corre brctl download): {src}", file=sys.stderr)
            vacios += 1
            continue
        md = convert(src)
        # Un resultado vacío casi siempre es el parser atorado en una región saltada.
        if len(md.strip().splitlines()) <= 2:
            print(f"  salida vacía, revisar a mano: {src}", file=sys.stderr)
            vacios += 1
            continue
        dst.write_text(md, encoding="utf-8")
        hechos += 1
        print(f"  {dst}")

    print(f"\n{hechos} generados · {saltados} ya al día · {vacios} con problema")
    return 1 if vacios else 0


if __name__ == "__main__":
    sys.exit(main())
