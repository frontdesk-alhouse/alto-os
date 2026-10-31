---
name: brand-to-website
description: Orquesta el workflow completo: referencias de marca + vibes → Design System → Sitemap → Copy → Website. Usa /brand-to-website para lanzarlo con tu brief y referencias.
---

# Brand to Website — Skill de Orquestación

Este skill lanza el workflow `brand-to-website` que convierte referencias visuales
y un brief de marca en un website completo, pasando por design system, sitemap y copy.

## Cuándo usarlo

- Tienes imágenes de referencia, un moodboard o "vibes" en texto
- Quieres construir un website desde cero con identidad visual propia
- Necesitas consistencia entre marca → diseño → copy → código

## Cómo invocarlo

Dile a Claude lo siguiente (ajusta los campos a tu proyecto):

```
Lanza el workflow brand-to-website con estos args:

brief: "Alto House es una agencia de viajes boutique que cuida cada experiencia..."
vibes: "Dark luxury editorial. Inspirado en revistas de arquitectura y viajes de alto nivel."
references: ["~/Desktop/ref1.jpg", "~/Desktop/ref2.png"]
stack: "HTML/CSS/JS"
pages: ["Home", "Paquetes", "Nosotros", "Contacto"]
outputDir: "~/projects/alto-house-web"
darkMode: false
```

## Args disponibles

| Arg | Tipo | Default | Descripción |
|-----|------|---------|-------------|
| `brief` | string | — | Descripción del producto/servicio/marca. Mientras más contexto, mejor. |
| `vibes` | string | — | Dirección estética en palabras: "dark luxury editorial", "swiss brutalism cálido", etc. |
| `references` | string[] | `[]` | Rutas absolutas o URLs a imágenes de referencia |
| `stack` | string | `"HTML/CSS/JS"` | Stack de salida: `"HTML/CSS/JS"`, `"React"`, `"Next.js"`, `"Vue"` |
| `pages` | string[] | `["Home"]` | Nombres de páginas a generar |
| `outputDir` | string | `/tmp/...` | Carpeta donde se escriben los archivos |
| `darkMode` | boolean | `false` | Genera variante dark con toggle |

## Lo que produce

1. **Perfil de marca** — mood, audiencia, personalidad, voz, elemento firma
2. **Dirección de diseño** — estilo preciso, riesgos visuales, qué evitar
3. **Design System** — paleta hex, tipografía (Google Fonts), espaciado, sombras, motion, bloque CSS `:root {}`
4. **Sitemap** — jerarquía de páginas + mapa de secciones por página
5. **Copy** — headlines, body, CTAs con voz de marca para cada sección
6. **Manifiesto de assets** — `assets/manifest.json` con cada imagen que el sitio necesita, su ruta, medidas, alt y un prompt ya dirigido por la paleta y la dirección de arte
7. **Website** — archivos HTML/CSS completos en `outputDir`, ya referenciando las rutas de assets con `width`/`height` explícitos
8. **Reporte QA** — score de accesibilidad + performance + consistencia, fixes automáticos de issues críticos

## Assets: por qué el render es un paso aparte

El workflow **planifica** las imágenes pero **no las genera**. Dos razones:

1. Cada imagen se cobra (~$0.04). El workflow corre en background y no puede pedirte aprobación a media ejecución.
2. El sitio no depende de ellas para quedar completo — el HTML ya apunta a las rutas correctas.

Al terminar el workflow verás el manifiesto con el conteo y el costo estimado. Si apruebas, el skill `nano-banana` renderiza el lote y los archivos caen donde el HTML ya los espera, sin tocar el markup.

Requisito una sola vez: `gemini extensions install https://github.com/gemini-cli-extensions/nanobanana` (interactivo, en tu terminal).

## Skills y agentes que orquesta

| Fase | Skills aplicados | Agentes |
|------|-----------------|---------|
| Brand Extraction | `brand`, `frontend-design` | architect |
| Design System | `design-system`, `ui-ux-pro-max` | — |
| Architecture | `design`, `ui-ux-pro-max` | planner |
| Copywriting | `brand` (voice) | marketing-agent |
| Build | `frontend-design`, `ui-styling`, `ui-ux-pro-max` | code-architect |
| QA | `accessibility-audit`, `asset-audit` | a11y-architect, performance-optimizer |

## Tips

- Entre más detallado el `brief`, mejor resultado. Incluye: qué hace el producto, a quién, qué lo diferencia.
- Los `vibes` funcionan bien con referencias de estilos específicos: nombres de marcas, revistas, directores de arte.
- Las `references` pueden ser capturas de pantalla, fotos, logos, paletas — cualquier archivo de imagen local.
- Si quieres iterar, edita `~/.claude/workflows/brand-to-website.js` y relanza con el mismo `outputDir`.
