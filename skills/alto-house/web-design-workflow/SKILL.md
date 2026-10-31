---
description: "Workflow completo brand-to-website: referencias de branding + vibes → Design System → Sitemap → Copy → Website. Orquesta 6 fases con agentes en paralelo."
argument-hint: "[brief del proyecto] [outputDir]"
---

# Alto House — Web Design Workflow

> Convierte referencias visuales, moodboards e imágenes de branding en un website
> completo con identidad visual propia. No produce templates genéricos.
>
> Produce: perfil de marca, dirección visual, design system (tokens CSS), sitemap,
> copy con voz de marca, archivos HTML/CSS finales y reporte QA.

---

## Cuándo usarlo

- Cliente nuevo necesita website desde cero con identidad visual propia
- Tienes imágenes de referencia, moodboard o "vibes" en texto
- Quieres consistencia real entre marca → diseño → copy → código
- El cliente rechazó propuestas que se veían genéricas o templated

---

## Cómo lanzarlo

```
Lanza el workflow brand-to-website con estos args:

brief: "[descripción del cliente: qué hace, a quién, qué los diferencia]"
vibes: "[dirección estética: 'dark luxury editorial', 'swiss brutalism cálido', etc.]"
references: ["/ruta/a/ref1.jpg", "/ruta/a/ref2.png"]
stack: "HTML/CSS/JS"
pages: ["Home", "Servicios", "Nosotros", "Contacto"]
outputDir: "/ruta/donde/guardar/el/website"
darkMode: false
```

---

## Las 6 fases

```
Referencias + Brief + Vibes
         │
         ▼
┌─────────────────────────────────────┐
│ FASE 1 · Brand Extraction (paralelo)│
│  Agente A — Estrategia de marca     │
│  Agente B — Dirección visual + memo │
└────────────────┬────────────────────┘
                 │
         ┌───────┴────────┐
         ▼                ▼
┌────────────────┐  ┌─────────────────┐
│ FASE 2a        │  │ FASE 2b         │
│ Design System  │  │ Architecture    │
│ Tokens + CSS   │  │ Sitemap +       │
│ :root { }      │  │ secciones       │
└────────┬───────┘  └──────┬──────────┘
         └────────┬─────────┘
                  ▼
┌─────────────────────────────────────┐
│ FASE 3 · Copywriting (paralelo)     │
│  Un agente por página               │
│  Voz de marca + reglas de copy      │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│ FASE 4 · Build (paralelo)           │
│  Un agente por página               │
│  Design system + copy aplicados     │
│  Elemento firma implementado        │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│ FASE 5 · QA (paralelo)              │
│  A11y · Performance · Diseño · SEO  │
│  Fix automático de issues críticos  │
└─────────────────────────────────────┘
```

---

## Skills y agentes que orquesta

| Fase | Skills | Agentes |
|------|--------|---------|
| Brand Extraction | `brand`, `frontend-design` | `architect` |
| Design System | `design-system`, `ui-ux-pro-max` | — |
| Architecture | `design`, `ui-ux-pro-max` | `planner` |
| Copywriting | `brand` (voice/messaging) | `marketing-agent` |
| Build | `frontend-design`, `ui-styling`, `ui-ux-pro-max`, `huashu-design` | `code-architect` |
| QA | `accessibility-audit`, `asset-audit` | `a11y-architect`, `performance-optimizer` |

---

## Outputs del workflow

| Output | Descripción |
|--------|-------------|
| `brandProfile` | Mood, audiencia, personalidad, voz, elemento firma |
| `designDirection` | Estilo preciso, riesgos visuales, anti-defaults memo |
| `tokens` | Paleta hex, tipografía Google Fonts, espaciado, sombras, motion |
| `tokens.cssVars` | Bloque `:root { }` listo para usar |
| `sitemap` | Jerarquía de páginas + secciones por página |
| `copy` | Headlines, body, CTAs por sección con voz de marca |
| Archivos HTML/CSS | En `outputDir/`, uno por página |
| QA report | Score por página + issues por severidad |

---

## Inputs disponibles

| Arg | Tipo | Default | Descripción |
|-----|------|---------|-------------|
| `brief` | string | — | Descripción del producto/servicio/marca |
| `vibes` | string | — | Dirección estética en palabras |
| `references` | string[] | `[]` | Rutas absolutas o URLs a imágenes de referencia |
| `stack` | string | `"HTML/CSS/JS"` | Stack de salida |
| `pages` | string[] | `["Home"]` | Páginas a generar |
| `outputDir` | string | `/tmp/...` | Carpeta de destino |
| `darkMode` | boolean | `false` | Genera variante dark con toggle |

---

## Principios de diseño que aplica (no negociables)

Tomados de `frontend-design` + `design-quality.md` del ECC:

1. **Anti-template**: no puede parecer un default de Tailwind/shadcn
2. **Elemento firma**: cada proyecto tiene un único elemento memorable, implementado en todas las páginas
3. **Gastar la audacia en un lugar**: el resto del diseño, quieto y disciplinado
4. **Tipografía con carácter**: pairing deliberado, no las mismas familias de siempre
5. **Copy activo**: voz activa, sin frases template, un trabajo por elemento
6. **Tokens primero**: cero colores hardcodeados, todo deriva del design system
7. **Semántica**: HTML semántico estricto, jerarquía de headings, ARIA completo

---

## Notas para clientes Alto House

- Usar con el research de `research-workflow` ya hecho: el `brief` debe incorporar
  el Problem Statement y los rasgos del buyer persona de la Rúbrica Blue Ocean.
- Los `vibes` se pueden derivar del Positioning Manifesto del cliente.
- Las `references` pueden ser screenshots de competidores que el cliente admira
  (pero que no quiere copiar) — el workflow extrae qué tomar y qué dejar.
- El `outputDir` puede ser la carpeta del cliente en iCloud para que el equipo lo vea.

---

## Archivo del workflow

```
~/.claude/workflows/brand-to-website.js
```

Para iterar en el workflow (editar fases, agregar lógica):
```bash
code ~/.claude/workflows/brand-to-website.js
```
