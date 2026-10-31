# Cómo se usan agentes vs MCPs vs skills

El OS tiene tres tipos de piezas. El error común es tratarlas igual o no usar los agentes. Esta es
la diferencia y cuándo usar cada una.

---

## Skills — metodología empaquetada
**Qué son:** flujos de trabajo completos con la metodología de Alto House adentro. Se invocan con
`/alto-house/<skill>` o describiendo la tarea.
**Cuándo:** cuando la tarea *es* una de las etapas del OS (research, brand-book, seo-schema, etc.).
**Cómo:** `/alto-house/research-workflow "Cliente" "industria"`. El skill orquesta todo — incluso
lanza agentes por dentro. No reimplementes lo que un skill ya hace.

## Agentes — sub-tareas delegadas (lo que hoy no se aprovecha)
**Qué son:** trabajadores especializados que corren una sub-tarea acotada y devuelven un resultado.
Corren en paralelo y no cargan tu contexto con el trabajo intermedio.
**Cuándo invocar uno explícitamente:**
- `seo-specialist` → auditar un sitio en producción (read-only, severidad). *En la etapa SEO.*
- `marketing-agent` → campañas, copy de anuncios, secuencias de email, guiones. *En digital.*
- `keyword-researcher` → solo el mapa de keywords (normalmente lo lanza `research-workflow`).
- `chief-of-staff` → triage de correos/mensajes multicanal.
- Revisores de código (`code-reviewer`, `react-reviewer`, etc.) → al construir CRM o sitio en código.
**Cómo pensarlo:** si dirías "que alguien me *audite* / *revise* / *investigue* esto en paralelo
mientras sigo", eso es un agente. Delega; no lo hagas inline.
**Proactivos:** algunos se activan solos (p. ej. revisión de código tras escribir). No hace falta
invocarlos a mano.

## MCPs — acceso a sistemas externos
**Qué son:** conexiones a herramientas reales (Webflow, Figma, Drive, Gmail, ClickUp, Similarweb,
Vercel, GoDaddy, Zapier, Notion, Framer, Calendar).
**Cuándo:** cuando hay que *leer o escribir* en esos sistemas.
**Lectura (seguro):** Similarweb (competencia), leer un sitio Webflow, buscar en Drive/Gmail.
**Escritura (confirmar primero):** publicar en Webflow, crear tareas en ClickUp, mandar correo
(siempre como **borrador**), crear archivos en Drive. Antes de escribir en un sistema externo,
confirma con el usuario.
**Fuera:** **Attio** ya no se usa — PM/CRM en **ClickUp + Notion**.

---

## Regla mental rápida

| Necesito… | Uso… |
|---|---|
| Ejecutar una etapa completa del OS | un **skill** `/alto-house/...` |
| Que alguien audite/revise/investigue algo en paralelo | un **agente** |
| Tocar Webflow / Figma / Drive / Gmail / ClickUp | un **MCP** |
| Saber qué de lo anterior aplica según dónde voy | el **os-router** ("voy en [etapa]") |

## El flujo que queremos

En vez de recordar manualmente qué invocar, di dónde vas: **"voy en el website de [cliente],
ayúdame con el hero"**. El router identifica la etapa, te dice el callout (skill + agente + MCP) y
lo dispara. El panel `GUIA_OS.md` en la carpeta del cliente hace que esto pase incluso sin nombrar
la etapa, porque ya está en contexto.
