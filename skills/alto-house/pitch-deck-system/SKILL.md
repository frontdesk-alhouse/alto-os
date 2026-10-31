---
name: ah-pitch-deck-system
description: "Sistema de templates de pitch deck de Alto House en Figma — 17 templates reutilizables + Reglas de Construcción (contrato de fidelidad vinculante) + generador de slides desde imagen de referencia. No es código: vive en un archivo Figma dedicado."
argument-hint: "(no CLI — ver comandos /pitch-template-library y /pitch-slide-from-image)"
metadata:
  author: alto-house
  version: "1.0.0"
  status: "producción — validado con un caso real"
---

# Alto House — Sistema de Templates de Pitch Deck

> Librería reutilizable de layouts de presentación (Figma), construida a partir del deck real
> del Cliente C Núñez y gobernada por un contrato de fidelidad explícito ("Reglas de
> Construcción") que cualquier generador/agente debe verificar antes de dar una diapositiva
> por terminada. Primer caso de uso real completo: el pitch de 3 Conceptos de Marca del propio
> Cliente C (Path / Lumen / Cero), documentado abajo.

---

## Dónde vive

| Qué | Dónde |
|---|---|
| **Librería de templates** (fuente de verdad, reutilizable) | Figma `Alto House — Pitch Deck Template` — fileKey `<fileKey>` |
| Página `Foundations` | Colores, tipografía y el bloque **"Reglas de Construcción"** (nodo `32:2`) |
| Página `Templates` | 17 templates client-facing |
| Comando de construcción/reparación de la librería | `~/.claude/commands/pitch-template-library.md` |
| Comando de generación de slide desde imagen de referencia | `~/.claude/commands/pitch-slide-from-image.md` |
| Agentes reusados (mismo motor que clone-to-figma, sin cambios) | `~/.claude/agents/figma-clone-generator.md`, `~/.claude/agents/figma-clone-evaluator.md` |
| Primer caso de uso real (deliverable de cliente) | Figma `Cliente C — Pitch 3 Conceptos` — fileKey `<fileKey>` |

No hay CLI ni carpeta de cliente involucrada — todo el trabajo ocurre directamente en archivos Figma vía MCP (`get_metadata`, `get_design_context`, `use_figma`, `upload_assets`).

---

## El contrato: Reglas de Construcción (`32:2`)

Se lee **fresco cada vez** (nunca de memoria/paráfrasis) antes de construir o corregir cualquier
diapositiva. 10 reglas actualmente:

| # | Regla | Resumen |
|---|---|---|
| 1 | Todo debe tocar algo | 0px de tolerancia: toda línea termina en otra línea, el borde del frame, o un componente |
| 2 | Convención de márgenes | Líneas estructurales de borde a borde; insets solo si coinciden con un elemento adyacente |
| 3 | Grosor de línea por contexto | Scaffold general = 0.75px hairline. Timeline = 1.5px |
| 4 | Timeline — spec específica | Eje 2px borde a borde, marcas de 62px, conector sin cruzar texto |
| 5 | Nunca dobles una línea ya cerrada | Si dos líneas caen a <2px, oculta la redundante (`visible=false`), nunca dejes doble línea |
| 6 | Retícula real | Grid 12 col × 10 fila, 1920×1080, margen 10px, gutter 20px — fórmulas exactas, con fallbacks documentados (punto medio, espaciado libre, margen de módulo) |
| 7 | Cluster Stack de slots iguales | N ítems de altura variable reparten la columna en N slots FIXED iguales — nunca hug+space-between |
| 8 | Roles tipográficos | Fraunces = narrativa/títulos, SOLO Regular, nunca itálica (no existe itálica en Foundations). Inconsolata = todo lo estructurado/tabular |
| 9 | Márgenes de texto y medida de párrafo | Texto alineado a un borde deja 1 columna limpia de margen; párrafos de cuerpo se limitan a 3 columnas (~460px) |
| 10 | Componentes compartidos: verificar contra la superficie real | Los componentes de `Components` (Header Bar, Footer Bar, Compact Spec Row...) traen por defecto líneas para panel claro — verificar explícitamente antes de usarlos sobre un panel oscuro, nunca asumir |

Cuando una regla no aplica a un template (ej. Timeline en uno sin línea de tiempo), su peso se
redistribuye proporcionalmente en el rubric del evaluador — nunca se puntúa como 0.

---

## Los 17 templates (página `Templates`)

| # | Template | Origen |
|---|---|---|
| 01 | Portada | Extraído del deck real |
| 02 | Contenido / TOC | Extraído — Cluster Stack de 5 |
| 03 | Topic Single | Extraído — caso de referencia de la Regla 7 |
| 04 | Topic Split (2 col) | Extraído — columnas desiguales |
| 05 | Timeline | Extraído — caso de referencia de la Regla 4 |
| 06 | Grid N-Col | Extraído |
| 07 | Imagen Top + 2Col | Extraído |
| 08 | Imagen + Texto | Extraído |
| 09 | Brand: Typography | Extraído |
| 10 | Brand: Logo Clearspace | Extraído |
| 11 | Cover Tema | Originado — spread tipo revista, tarjeta + imagen + palabra rotada |
| 12 | Statement Pillars | Originado — 3 pilares, collage superpuesto, texto alineado a la derecha |
| 13 | Do/Dont Table | Originado |
| 14 | Cierre | Originado |
| 15 | Typography + Foto | Originado |
| 16 | Asset Showcase | Originado |
| 17 | Tono de Voz | Originado — collage asimétrico + 4 valores indexados |

Todos pasaron por auditoría determinista (evaluador basado en coordenadas exactas, no "se ve
bien") y por correcciones dirigidas por el usuario. Fixes de esta sesión: Footer Bar 0.5px corto
(corregido a nivel de componente, se propagó a 12 instancias), Cluster Stack starvation en varios
templates, drift de 10px en Topic Split, contraste de líneas en templates de panel oscuro
(Statement Pillars, Brand Typography — línea calibrada para panel claro usada por error sobre
panel oscuro, corregido a nivel de instancia).

---

## Generador↔Evaluador: el mismo motor de `clone-to-figma`, 3 modos

No se crearon agentes nuevos. `figma-clone-generator`/`figma-clone-evaluator` ya soportan:

1. **Modo extract** (Figma→Figma) — lee un nodo fuente vía `get_design_context` en su propio
   `fileKey` y construye en el archivo destino en la misma invocación (sin fase de recon de
   navegador, a diferencia de clonar un sitio web).
2. **Modo generate** — brief-driven, sin fuente (templates originados: Cierre, Do/Dont, Pillars,
   Section Divider, etc.).
3. **Rubric doble con compuerta AND** (para `/pitch-slide-from-image`) — fidelidad estructural a
   la imagen de referencia (screenshot, nunca premia color/fuente de la referencia) Y
   cumplimiento de marca (Reglas de Construcción) — nunca promediados. Una slide con estructura
   perfecta pero un color tomado de la referencia debe reprobar.

---

## Riesgo conocido y mitigación obligatoria

**Los agentes generadores han insertado contenido no solicitado más de una vez** en esta sesión:
imágenes de investigación reales en vez de placeholders vacíos, bloques de swatches de paleta,
isotipos reconstruidos a mano en vez de importar el vector real, texto en fuentes fuera del
sistema (Playfair Display, Kaftan Serif directo). Esto ocurrió incluso después de que un
screenshot inicial se viera limpio — la mutación llegó después de la verificación.

**Regla operativa fija para todo trabajo futuro con este sistema:**
- Después de cualquier build o fix, verificar con `get_design_context` (no solo
  `get_screenshot`) que no haya `<img>` no solicitados, texto en fuentes fuera de
  Fraunces/Inconsolata, ni nodos duplicados de header/footer.
- Preferir scripts directos (`use_figma`) sobre agentes generadores para ediciones mecánicas de
  bajo riesgo (recolorear, mover, borrar) — reservar los agentes para construcción estructural
  nueva.
- `.remove()` puede no-opear silenciosamente — siempre re-verificar con `get_metadata` que el
  nodo realmente desapareció.
- Máximo 3-4 agentes en paralelo (límite de sesión de la cuenta, ya golpeado varias veces).

---

## Caso de uso real: Cliente C — 3 Conceptos de Marca

Primer deliverable de cliente construido con este sistema. Figma `Cliente C — Pitch 3
Conceptos` — fileKey `<fileKey>`, página `Pitch`.

**7 diapositivas**, todas en tokens de Alto House (no en la paleta real de cada concepto — decisión
explícita del usuario, revertida de un primer intento que sí usaba paleta por concepto):

| # | Diapositiva | Estado |
|---|---|---|
| 01 | Overview (Path · Lumen · Cero, 3 columnas) | ✅ |
| 02 | Path — Storytelling | ✅ — 4 imágenes reales del moodboard de Brand Direction |
| 03 | Path — Isotipo | ✅ — vector real (`PATH ISO.svg`) |
| 04 | Lumen — Storytelling | ✅ — 4 imágenes reales del moodboard |
| 05 | Lumen — Isotipo | ✅ — versión dibujada a mano (el usuario decidió conservarla, no reemplazar por el `.svg` real) |
| 06 | Cero — Storytelling | ✅ — 4 imágenes reales del moodboard, copy final iterado en conversación |
| 07 | Cero — Isotipo | ✅ — vectores reales re-teñidos a token Alto |

Tokens usados: `Alto/Crema BG` #DDD1C5, `Alto/Oscuro BG` #323232, `Alto/Texto Oscuro` #000000,
`Alto/Texto Claro` #FBF8F2, `Alto/Regla sobre Claro` #4A4544, `Alto/Regla sobre Oscuro` #FBF8F2.

**Nota de higiene pendiente**: el archivo tiene 2 frames fuera del alcance pedido ("Branding ·
Portada" y "08 — Website") que aparecieron durante la construcción — el usuario pidió dejarlos
sin tocar para revisarlos él mismo, no están documentados como parte del deliverable de 7
diapositivas.

**Copy final de Cero** (cerrado en conversación, vive solo en el archivo Figma — no hay `.md`
maestro separado para este deck): tagline "Una incisión de un centímetro es la distancia entre tú
y regresar a tu vida...", eje = punto antes de la enfermedad, tono Cuidador/Sabio.

---

## Próximos pasos no iniciados (mencionados en sesión, sin ejecutar)

- Extender la Regla 3 (0.75px) a los 11 templates con líneas locales que aún no la tienen
  (heredada solo por componentes compartidos, no por nodos sueltos por frame).
- Pase 2px→1.5px en el timeline del template 05.
- Fix del mismo problema de línea-confinada-al-header en el componente compartido `Cluster Item`
  (templates 03/04 lo heredan, template 17 ya no lo usa — se reemplazó por una construcción
  propia).
- Verificación `use_figma` de binding real de Paint/Text Styles (vs. hex hardcodeado que coincide
  por casualidad) — marcado como no verificable con las herramientas de solo lectura usadas hasta
  ahora.
