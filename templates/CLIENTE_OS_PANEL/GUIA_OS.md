# GUÍA OS — [NOMBRE DEL CLIENTE]
> Panel de control del cliente. Espeja el mapa del Alto House OS (`os-router`) como checklist de
> estado. Vive en la carpeta del cliente para que, al trabajar aquí, el OS enrute solo.

---

## Cómo usar este panel

1. Copia esta carpeta a `clientes/[cliente]/` y renombra `[NOMBRE DEL CLIENTE]` arriba.
2. Marca el estado de cada etapa conforme avanzas: `⬜ pendiente` · `🟡 en curso` · `✅ hecho`.
3. Para pedir ayuda, **di dónde vas**: *"voy en [etapa] de [cliente], ayúdame con X"*. Como este
   archivo está en contexto, Claude dispara el skill/agente/MCP correcto.
4. Si Claude no enruta solo, invoca el skill: `/alto-house/os-router [etapa]`.

**Datos del cliente:**
- Vertical (para SEO/schema): `real-estate | medical | product | generic` → **[llenar]**
- Carpeta: `clientes/[cliente]/`
- Proyecto ClickUp: **[link]** · Carpeta Drive: **[link]** · Figma: **[link]**

---

## Estado por etapa

| # | Etapa | Estado | Callout (di esto → dispara esto) |
|---|-------|--------|-----------------------------------|
| 1 | Onboarding | ⬜ | "voy arrancando a [cliente]" → `00_BRIEF` + brand-book `intake` · ClickUp/Drive/Gmail/Calendar |
| 2 | Research | ⬜ | "voy en research" → `/alto-house/research-workflow` + `social-listening` · Similarweb |
| 3 | Estrategia | ⬜ | "voy en la estrategia" → `research-workflow` F2-3, `market-differentiation` · ECC council |
| 4 | Pitch/Venta | ⬜ | "voy a armar el pitch" → `estrategia-light`, `pitch-deck-system` · Figma |
| 5 | Marca | ⬜ | "voy en branding" → `/alto-house/brand-book` · Figma |
| 6 | Website | ⬜ | "voy en el website" → workflow `brand-to-website` · Webflow/Figma/Vercel |
| 7 | SEO | ⬜ | "voy en SEO" → `/alto-house/seo-schema` · agente `seo-specialist` · Webflow |
| 8 | Estrategia Digital | ⬜ | "voy en digital" → `/alto-house/estrategia-digital` · agente `marketing-agent` |
| 9 | Entrega | ⬜ | "voy a entregar a [cliente]" → crm-client-delivery PASO 8 · Drive/Gmail/ClickUp |
| 10 | Retainer/Reporte | ⬜ | "toca reporte de [cliente]" → dashboard-builder + strategic-compact · GA4/GSC (Zapier) |

> Detalle completo de cada etapa (cuándo, entregable, qué sigue): skill `os-router` →
> `references/stage-map.md`. Cómo se usan agentes/MCPs/skills: `references/como-usar.md`.
> *Attio no se usa — PM/CRM en ClickUp + Notion.*

---

## Bitácora

| Fecha | Etapa | Qué se hizo | Siguiente |
|-------|-------|-------------|-----------|
|       |       |             |           |

---

## KPIs (para el retainer — etapa 10)

Se llenan al entregar (`Research/04_ENTREGAR.md`) y se miden mes a mes.

| KPI | Baseline | Target | Mes actual |
|-----|----------|--------|------------|
|     |          |        |            |
