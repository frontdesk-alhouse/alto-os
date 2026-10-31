---
name: entregable-legible
description: "Genera el gemelo Markdown de un entregable HTML de cliente para que cualquier agente (Codex, Claude, NotebookLM, Gemini) pueda leerlo, preservando las tablas. Úsala al terminar un entregable HTML, al abrir una carpeta de cliente cuyos .html no tienen gemelo .md, o antes de exportar material a NotebookLM."
---

# Entregable legible

Los entregables de cliente de Alto House (minutas, censos, investigaciones, planes, reportes)
viven como **HTML con tablas semánticas**. Un agente que solo puede leer texto pierde justo lo
que más importa: la relación columna-valor de las tablas.

Este skill deja un gemelo `.md` al lado de cada `.html`. El HTML sigue siendo el entregable
que ve el cliente; el `.md` existe para que lo lea una máquina.

## Uso

```bash
S=~/.agents/skills/entregable-legible/scripts/html2md.py

python3 "$S" "ruta/al/entregable.html"          # un archivo, deja entregable.md al lado
python3 "$S" --dir "10_Clientes/ACTIVE/Cliente A"  # toda la carpeta, salta los que ya están al día
python3 "$S" --dir "…" --force                  # regenera todo
```

Es incremental: salta el gemelo cuyo `mtime` ya es posterior al del HTML.

## Las tres trampas

1. **`textutil -convert txt` no sirve.** Aplana cada `<td>` a su propia línea y destruye la
   relación columna-valor: una tabla de cuatro fuentes queda como `ABCD` en un renglón. Además
   lee mal el UTF-8. Nunca usarlo para estos archivos.
2. **Los tags void (`br`, `meta`, `link`, `img`, `hr`) no cierran.** Si cuentan para la
   profundidad de una región saltada (`<head>`, `<style>`, `<svg>`), el parser se queda atorado
   y devuelve vacío. El script ya los excluye; si tocas el parser, no rompas eso.
3. **Un `.html` de 0 bytes en iCloud casi nunca está vacío: está desalojado.** El script lo
   detecta y avisa en vez de escribir un gemelo en blanco. Materializa antes con
   `brctl download "<ruta>"`.

Si el script reporta "salida vacía", casi siempre es la trampa 2 con un tag raro, no un HTML malo.

## Lo que no es un archivo

Figma, Webflow, Notion y Sheets **no se convierten: se extraen**. La regla es la misma
—dejar un `.md` legible junto al proyecto— pero el origen es la herramienta:

- **Figma** → spec de estructura y tokens, como los que produce `clone-to-figma`.
- **Webflow** → censo de páginas, clases y variables, como el de `auditoria-sitio-completo`.
- **Sheets** → export a CSV junto al resto del material.

Un entregable que solo existe dentro de una herramienta es un entregable que el siguiente
agente no puede leer.

## A dónde va

El gemelo va **al lado** del HTML, con el mismo nombre. Nunca en una carpeta aparte: la
cercanía es lo que hace que se encuentre solo.

Para NotebookLM el gemelo no basta. Ahí el problema no es el formato sino la fragmentación:
25 archivos con nombres opacos producen citas sin contexto. Consolidar en ~6 fuentes temáticas,
cada una con encabezado de cliente y fecha, y nota del archivo origen por sección.
