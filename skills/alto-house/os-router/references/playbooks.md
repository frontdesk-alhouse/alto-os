# Registro de playbooks — el motor de decisión de `/ah`

Este archivo es lo que convierte el `stage-map.md` (conocimiento) en despacho (ejecución).
Cada playbook declara sus **prerequisitos**, sus **agentes**, su **escritura** y sus **gates**.
`/ah` lo consulta para decidir entre ejecutar directo o proponer.

---

## La regla conocido/nuevo

Un reto se ejecuta **directo** (anunciando qué lanza, sin pedir OK) solo si se cumplen las cuatro:

1. **Mapea** a un playbook de la tabla de abajo.
2. **Prerequisitos cumplidos** — el estado real del cliente los satisface.
3. **Escritura local** — solo escribe dentro de la carpeta del cliente.
4. **Sin gate humano** en el camino.

Si falla **cualquiera** → propone el plan y espera OK.

Escribir en Webflow, Figma, ClickUp, Gmail, Drive o cualquier sistema externo **siempre** cae en
*propone*, aunque el playbook exista y los prerequisitos estén completos. Los correos, siempre
como borrador.

Sin playbook que mapee, el reto es **nuevo**: `/ah` arma un plan desde cero, lo explica y espera OK.

---

## Límite de concurrencia

**Máximo 4 agentes en paralelo. Nunca más.** Está documentado en
`../../pitch-deck-system/SKILL.md:124` tras golpear el límite de sesión varias veces.
Si un playbook pide más, se agenda en tandas de ≤4 y se dice cuántas tandas serán.

---

## Playbooks

### PB-01 · Onboarding de cliente nuevo
| | |
|---|---|
| **Frases** | "arranqué con X", "cerró X", "montar carpeta de X", "onboarding de X" |
| **Etapa** | 1 |
| **Prerequisitos** | La carpeta del cliente existe en `10_Clientes/` |
| **Agentes** | ninguno |
| **Hace** | Actualiza `STATUS.md`; mueve `PROSPECTING/` → `ACTIVE/` si cerró; copia `RESEARCH_TEMPLATE/` a `03_Strategy Docs/Research/`; crea `Research/_raw/` |
| **Escritura** | local |
| **Gates** | Mover carpeta y crear proyecto en ClickUp → **confirmar** |
| **Modo** | directo para el scaffolding · propone para ClickUp/Drive/Gmail |

### PB-02 · Research Fase 1 (Descubrir)
| | |
|---|---|
| **Frases** | "corre research", "fase 1", "investiga a X", "descubrir" |
| **Etapa** | 2 |
| **Prerequisitos** | `Research/` existe · se conoce industria y ciudad/mercado |
| **Agentes** | **4 en paralelo** — `ah-digital-auditor` (A), `ah-competitive-intel` (B), `ah-keyword-mapper` (C), y **uno** de: `ah-social-listener` (D-B2C) o `ah-demand-intel` (D-B2B) |
| **Elección del carril D** | ¿Quién le compra al cliente? Persona física → B2C. Empresa, industria o gobierno → **B2B**. **Si le vende a los dos, corre los dos** — ver abajo. Ante la duda, pregunta: es la única decisión del playbook que no se deduce de la carpeta. |

> **El carril D no es una elección excluyente cuando hay dos segmentos.** Un cliente puede vender a
> la vez a un comprador institucional y a uno pequeño, y son dos mundos de evidencia distintos: el
> institucional deja rastro documental (licitaciones, normativa) y **cero conversación**; el pequeño
> deja **conversación pública** y cero documentos. Elegir uno solo deja la mitad del mercado sin
> investigar.
>
> Caso real: en Cliente E se eligió B2B por las constructoras, y se perdió de vista al que
> compró un terreno y no sabe si puede construir — que resulta ser **el comprador del producto de
> entrada**. Se corrigió corriendo `ah-social-listener` como quinto carril.
>
> **Regla:** si el cliente atiende dos segmentos claramente distintos, los dos carriles D van. Son 5
> agentes, así que se agendan en **dos tandas** para respetar el techo de 4.
| **Hace** | Los 4 escriben a `Research/_raw/agente-{a,b,c,d}.md` |
| **Escritura** | local |
| **Gates** | **Quality Gate F1** tras la consolidación — checklist real, no automático |
| **Modo** | **directo** |
| **Consolidación** | La hace la sesión principal, **no un agente**: lee los 4 `_raw`, produce `01_DESCUBRIR.md` y corre el Quality Gate de `../../research-workflow/SKILL.md:130` |

### PB-03 · Research Fases 2-4 (Definir / Desarrollar / Entregar)
| | |
|---|---|
| **Frases** | "arma la rúbrica", "buyer personas", "recomendación central", "fase 2/3/4" |
| **Etapa** | 3 |
| **Prerequisitos** | `01_DESCUBRIR.md` existe y pasó su Quality Gate |
| **Agentes** | ninguno en paralelo — es trabajo de criterio. Apoyo: skills `council`, `strategic-compact`, `ah-market-differentiation` |
| **Escritura** | local |
| **Gates** | Un Quality Gate por fase |
| **Modo** | **conversacional** — no se paraleliza; la Rúbrica exige juicio sobre evidencia |

### PB-04 · Pitch / Estrategia Light
| | |
|---|---|
| **Frases** | "arma el pitch", "estrategia light", "cotización", "deck para X" |
| **Etapa** | 4 |
| **Prerequisitos** | Fase 2 mínimo (personas + Rúbrica) |
| **Agentes** | `figma-clone-generator` / `figma-clone-evaluator` vía `ah-pitch-deck-system` |
| **Escritura** | **Figma — externa** |
| **Gates** | Reglas de Construcción del deck · verificar con `get_design_context`, no solo screenshot |
| **Modo** | **propone** (escribe en Figma) |

### PB-05 · Brand Book
| | |
|---|---|
| **Frases** | "brand book", "identidad", "branding de X", "retoque de logo" |
| **Etapa** | 5 |
| **Prerequisitos** | Research Fase 2 mínimo — `ah-brand-book` lo exige explícitamente |
| **Agentes** | aún ninguno (pendiente de construir) · skill `brand-voice` |
| **Escritura** | local + **Figma** |
| **Gates** | **Elección de dirección creativa — decisión humana, no delegable.** No avanzar al lock sin consenso explícito |
| **Modo** | **propone** |

### PB-06 · Website / Build
| | |
|---|---|
| **Frases** | "el sitio", "landing", "construir web" |
| **Etapa** | 6 |
| **Prerequisitos** | Design system o tokens definidos · sitemap o brief |
| **Agentes** | los del workflow `brand-to-website.js` |
| **Escritura** | local + **Webflow / Figma** |
| **Gates** | Aprobación de render de imágenes (costo) · **copy → Webflow solo con OK explícito** · higiene Webflow antes de publicar |
| **Modo** | **propone** |

### PB-07 · SEO / Schema / GEO
| | |
|---|---|
| **Frases** | "SEO", "schema", "metadata", "antes de publicar", "GEO", "ChatGPT", "visibilidad en IA", "llms.txt" |
| **Etapa** | 7 |
| **Prerequisitos** | Sitio existente o copy definido |
| **Agentes** | el skill `ah-seo-geo` genera (schema, metadata, robots para bots de IA, llms.txt) · `ah-ai-visibility` mide la citación en asistentes · `seo-specialist` audita (read-only, opcional) |
| **Escritura** | local para generar · **Webflow** para aplicar |
| **Gates** | Validación en validator.schema.org + Rich Results Test → 0 errores · checklist de higiene Webflow · gate GEO del checklist · línea base de citación corrida antes de publicar cambios |
| **Modo** | directo para generar y auditar · **propone** para aplicar |

### PB-08 · Estrategia Digital
| | |
|---|---|
| **Frases** | "redes", "contenido", "estrategia digital", "reseñas", "WhatsApp" |
| **Etapa** | 8 |
| **Prerequisitos** | Research Fase 2 mínimo |
| **Agentes** | `marketing-agent` · skill `content-engine` |
| **Escritura** | local |
| **Gates** | 12 Quality Gates del skill |
| **Modo** | **directo** |

### PB-09 · Entrega / Handoff · *gap*
| | |
|---|---|
| **Etapa** | 9 |
| **Estado** | Sin skill. Se recicla el PASO 8 de `ah-crm-client-delivery`, que está pensado para un CRM |
| **Modo** | **propone**, diciendo que es un gap |

### PB-10 · Retainer / Reporte · *gap*
| | |
|---|---|
| **Etapa** | 10 |
| **Estado** | Sin skill ni MCP de GA4/GSC. Se apoya en `strategic-compact` leyendo KPIs de `04_ENTREGAR.md` |
| **Modo** | **propone**, diciendo que es un gap |

---

## Cómo se deduce el estado del cliente

Sin preguntar. En este orden, parando en cuanto haya señal suficiente:

1. **`STATUS.md`** en la raíz de la carpeta — si existe, manda. **Verifica su fecha**: si tiene más
   de ~3 semanas o contradice lo que se ve en disco, dilo y ofrece actualizarlo antes de seguir.
2. **Sondeo del filesystem** — barato y no miente:
   - `03_Strategy Docs/Research/` → ¿hasta qué `0X_*.md` llegó? ¿hay `_raw/`?
   - `02_Brand/` → ¿vacío o con `brand-book/`, `globals.css`, `figma-url.txt`?
   - `04_Website/` → ¿hay `Copy/`, `SEO/`, `Landing/` con contenido?
   - `08_Reporting/` → ¿hay reportes? Si sí, el cliente está en retainer.
3. **`.claude/` propio del cliente** — hooks y reglas locales que mandan sobre lo global
   (Cliente C tiene un hook que bloquea escritura en Webflow).
4. **En qué subcarpeta de `10_Clientes/` vive** — ACTIVE, PROSPECTING o NOT CLOSED.

Una carpeta con estructura creada pero vacía significa **scaffolding hecho, trabajo no empezado**.
No lo confundas con etapa avanzada.

---

## Gates que nunca se saltan

| Gate | Dónde vive | Naturaleza |
|---|---|---|
| Copy → Webflow | Hook `PreToolUse` en `.claude/settings.json` del cliente · requiere marcador `.claude/.webflow-copy-approved` | Duro, bloquea la herramienta |
| Render de imágenes | `brand-to-website.js` produce manifiesto y para | Duro, por costo |
| Validación clínica | Cliente C — `00_VALIDACION` | Bloqueante |
| Dirección de marca | `ah-brand-book` | Humano, no delegable |
| Quality Gates de research | Uno por fase | Checklist humano |
| Higiene y schema Webflow | Antes de publicar | Checklist + validadores |
| Escritura en sistemas externos | Regla global del OS | Confirmar siempre · correos como borrador |
