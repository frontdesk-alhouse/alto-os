---
name: clone-to-framer
description: "Harness Figma → Framer. Lee el diseño aprobado en Figma, estudia (y si sirve, remixa) una plantilla de referencia del marketplace, construye en una RAMA del proyecto Framer con componentes de variantes + Overlays + CMS, mide cada pantalla contra el PNG de Figma con el motor de clone-to-webflow (diff/score), corre gates funcionales y entrega un informe para auditar. Nunca publica: publicar en Framer actualiza producción y es gate humano. Úsalo siempre que se vaya a construir, portar o corregir una página o sección en Framer a partir de Figma."
metadata:
  author: alto-house
  version: "0.1.0"
  status: "primera corrida: Recursos · Alto OS (altohouse.mx), 2026-10-29"
---

# Clone-to-Framer

Hermano de `clone-to-webflow`. Mismo principio: **el ojo dice «se parece», el número dice otra cosa**; se cierra el bucle con un scorer determinista y con un evaluador a ciegas solo donde aporta (calidad).

## Reglas no negociables
1. **Nunca publicar.** En Framer, Publish actualiza el dominio de producción. Todo se construye en una **rama** (`?branch=`) y se verifica en Preview. Publicar/fusionar es de la persona, con palabras.
2. **Línea base de publicación**: antes de empezar se guarda `deploymentTime` (`getProjectWebsiteUrl`); al terminar tiene que ser el mismo.
3. **Gana la procedencia**: si Figma y el sitio discrepan en algo ya aprobado en el sitio (navbar, estilos de texto), gana el sitio.
4. **Fuentes reales**: los estilos del proyecto Framer mandan; las sustitutas de Figma no se trasladan.
5. **Reportar lo no logrado con su número** (`DESVIACION`), nunca inflar el score.
6. **Copy de cliente** solo con «aplícalo» explícito (mismo gate que Webflow).

## Fases
| # | Fase | Qué | Herramientas |
|---|---|---|---|
| 0 | Instrumento | `npm run selftest` en `~/.agents/skills/clone-to-webflow` = `INSTRUMENTO 22/22 VALIDADO`; guardar línea base de publicación | Bash, Framer MCP |
| 1 | Recon de referencia | Si hay plantilla del marketplace: «Remix for free» en Chrome, conectar Tommy's MCP, `getProjectXml`/`getNodeXml` de página, componentes y variante Phone → `recon-<plantilla>.md` (arquitectura y qué se adopta) | Chrome, Framer MCP |
| 2 | Base | Rama nueva; colecciones CMS (CSV import desde la interfaz → colecciones del usuario, no gestionadas por plugin); componentes con variantes (ventana, ítems, íconos) | Chrome, Framer MCP |
| 3 | Construcción por bandas | escritorio (1440) → móvil (390) → tablet/responsividad; páginas CMS por ítem | Framer MCP (`updateXmlForNode`), Chrome para Interactions/Overlays |
| 4 | Loops | por pantalla: captura en Preview (Chrome) → `diff.mjs`/`score.mjs` contra PNG 1:1 de Figma con máscara de texto → evaluador a ciegas → corrige; máx 5 vueltas, PASS ≥ 8.5 | motor de clone-to-webflow, `figma-clone-evaluator` |
| 5 | Gates | overlays abren/cierran, Esc, tooltips, hover/focus, sin desborde 390/768/1310/1440, formulario envía, JSON-LD en páginas CMS, un H1 | Chrome |
| 6 | Informe | `INFORME.md` con tabla pantalla/score/vueltas/desviaciones, gates, pendientes y links a rama/Preview | — |

Gotchas de Framer: `references/gotchas-framer.md` (leer antes de la fase 2).
