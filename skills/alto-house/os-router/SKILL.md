---
description: "Enrutador del Alto House OS. Cuando el usuario dice en qué etapa del cliente va — 'voy en branding', 'voy en el website', 'voy en research', 'voy en estrategia digital', 'toca reporte', 'qué uso para X', 'ayúdame con esta etapa' — identifica la etapa y devuelve el callout exacto: qué skill lanzar (con su trigger), qué agente invocar y qué MCP tocar. También explica cómo se usan agentes vs MCPs vs skills. Úsalo siempre que el usuario nombre una etapa del ciclo de cliente o pida ayuda de proceso."
argument-hint: "[etapa: onboarding|research|estrategia|pitch|marca|website|seo|digital|entrega|reporte]"
---

# Alto House — OS Router

> El OS deja de ser una caja de herramientas suelta. Este skill es el **enrutador**: dado dónde
> vas en el cliente, te dice exactamente **qué skill, qué agente y qué MCP** usar — y te ofrece
> dispararlo. Resuelve el problema de "tengo los assets pero no los uso como debería".

**Input**: $ARGUMENTS (la etapa, o una frase natural tipo "voy en el website de [cliente]")

---

## Cómo actúa este skill

Cuando el usuario nombra una etapa o pide ayuda de proceso:

1. **Identifica la etapa** (1-10) a partir de la frase. Mapea sinónimos: "branding/identidad" → 5;
   "web/sitio/página" → 6; "SEO/schema/posicionamiento" → 7; "redes/social/contenido/digital" → 8;
   "reporte/retainer/mensual/KPIs" → 10; etc.
2. **Devuelve el callout** de esa etapa desde `references/stage-map.md`: el skill con su trigger
   exacto, el/los agente(s) a invocar, y el/los MCP(s) a tocar.
3. **Ofrece dispararlo**: "¿Lanzo `/alto-house/seo-schema` para [cliente]?" — no lo ejecuta sin
   confirmar si implica escribir en sistemas externos.
4. Si la etapa es un **gap** (sin skill dedicado: onboarding, entrega, reporte), enruta al asset
   provisional y lo dice honestamente.
5. Si hay `clientes/[cliente]/GUIA_OS.md`, **léelo primero**: es el panel curado + estado de ese
   cliente y manda sobre el mapa genérico.

## El mapa (resumen — detalle en `references/stage-map.md`)

| Etapa | Frase típica | Callout principal |
|---|---|---|
| 1. Onboarding | "voy arrancando a X" | *gap* → `00_BRIEF` + brand-book `intake` · MCP: ClickUp, Drive, Gmail, Calendar |
| 2. Research | "voy en research" | `/alto-house/research-workflow` + `social-listening` · agente keyword-researcher · MCP Similarweb |
| 3. Estrategia | "voy en la estrategia" | `research-workflow` (fases 2-3), `market-differentiation` · ECC council, strategic-compact |
| 4. Pitch/Venta | "voy a armar el pitch" | `estrategia-light`, `pitch-deck-system` · MCP Figma |
| 5. Marca | "voy en branding" | `/alto-house/brand-book` · ECC brand-voice · MCP Figma |
| 6. Website | "voy en el website" | workflow `brand-to-website`, `crm-client-delivery` · MCP Webflow, Figma, Vercel, Framer |
| 7. SEO | "voy en SEO" | `/alto-house/seo-schema` · agente seo-specialist · MCP Webflow |
| 8. Estrategia Digital | "voy en digital" | `/alto-house/estrategia-digital` · agente marketing-agent · ECC content-engine, crosspost |
| 9. Entrega | "voy a entregar a X" | *gap* → crm-client-delivery PASO 8 · MCP Drive, Gmail, ClickUp |
| 10. Retainer/Reporte | "toca reporte de X" | *gap* → ECC dashboard-builder + strategic-compact · MCP GA4/GSC (Zapier), Similarweb, Webflow |

> **Attio queda fuera del stack.** PM/CRM se apoya en **ClickUp + Notion**.

## Referencias

- `references/stage-map.md` — el mapa completo: por etapa, cuándo estás ahí, skills con trigger,
  agentes (cuándo invocar cada uno), MCPs (lectura/escritura), entregable y qué sigue.
- `references/como-usar.md` — cómo se usan **agentes vs MCPs vs skills** (el hábito que falta hoy).

## Panel por cliente

Al arrancar un cliente, copiar `templates/CLIENTE_OS_PANEL/GUIA_OS.md` a
`clientes/[cliente]/GUIA_OS.md`. Ese panel espeja este mapa como checklist de estado y hace que
trabajar dentro de la carpeta del cliente enrute solo.
