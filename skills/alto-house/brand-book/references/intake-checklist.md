# Checklist de Mínimos — Brand Book

Mostrar al correr `init`. Marcar ✓ si existe el archivo/carpeta, ✗ si falta.

---

## Obligatorio para correr `generate`

- [ ] **Logo SVG** — vertical + horizontal mínimo (`brand/logo/`)
- [ ] **Colores** — paleta en HEX primary/secondary/accent/neutral (`brand/colors.json`)
- [ ] **Tipografía display** — nombre de Google Fonts o archivo OTF/TTF (`brand/fonts/display/`)
- [ ] **Tipografía body** — nombre de Google Fonts o archivo OTF/TTF (`brand/fonts/body/`)
- [ ] **Intake completo** — voz, tono, personalidad, manifiesto (`brand/00-brief.md`)
- [ ] **Dirección creativa** — concepto aprobado, brief de logo (`brand/02-creative-direction.md`)

## Obligatorio para calidad visual del brand book

- [ ] **Fotografía** — mínimo 3 imágenes reales (`brand/referencias/fotografia/`)
  - Si faltan: la skill genera propuestas de sourcing + prompts de IA por cada slot

## Recomendado

- [ ] Isotipo / variante app icon del logo (`brand/logo/isotipo.svg`)
- [ ] Iconografía de marca si ya existe (`brand/referencias/elementos-graficos/`)
- [ ] Patrones o texturas si ya existen (`brand/referencias/elementos-graficos/`)
- [ ] Lista de ítems de Activation confirmada (`brand/activation-items.md`)
- [ ] Referencias de websites que inspiran (`brand/referencias/website/`)
- [ ] Referencias de branding que admira el cliente (`brand/referencias/branding/`)

---

## Estructura de `colors.json`

```json
{
  "primary": {
    "name": "Verde Bosque",
    "hex": "#35544E",
    "rgb": { "r": 53, "g": 84, "b": 78 },
    "cmyk": { "c": 37, "m": 0, "y": 7, "k": 67 },
    "usage": "Color principal, fondos oscuros, CTAs"
  },
  "secondary": {
    "name": "Crema",
    "hex": "#ECE5DA",
    "rgb": { "r": 236, "g": 229, "b": 218 },
    "cmyk": { "c": 0, "m": 3, "y": 8, "k": 7 },
    "usage": "Fondo principal, texto sobre oscuros"
  },
  "accent": {
    "name": "Terracota",
    "hex": "#9E3A26",
    "rgb": { "r": 158, "g": 58, "b": 38 },
    "cmyk": { "c": 0, "m": 63, "y": 76, "k": 38 },
    "usage": "Acentos, highlights, datos"
  },
  "neutral": {
    "name": "Carbón",
    "hex": "#3D3D3D",
    "rgb": { "r": 61, "g": 61, "b": 61 },
    "cmyk": { "c": 0, "m": 0, "y": 0, "k": 76 },
    "usage": "Texto, elementos oscuros"
  }
}
```
