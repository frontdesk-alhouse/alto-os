# Mapa de etapas del Alto House OS

El ciclo completo de un cliente, etapa por etapa. Para cada una: cuándo estás ahí, qué **skill**
lanzar (con su trigger), qué **agente** invocar (y cuándo), qué **MCP** tocar, el entregable y qué
sigue. *Attio queda fuera; PM/CRM = ClickUp + Notion.*

---

## 1. Onboarding / Kickoff  ·  *(gap: sin skill dedicado)*
**Estás aquí si:** cerraste al cliente y hay que arrancar — recolectar assets, accesos, y montar la
estructura de trabajo.
- **Skills:** aún no hay skill dedicado. Usa `00_BRIEF.md` (llenado por equipo) + el modo `intake`
  de `/alto-house/brand-book`.
- **Agentes:** —
- **MCPs:** **ClickUp** (crear proyecto + tareas), **Drive** (carpeta del cliente), **Gmail**
  (borrador de bienvenida), **Calendar** (llamada de kickoff).
- **Entregable:** carpeta del cliente montada (copiar `RESEARCH_TEMPLATE/` y `GUIA_OS.md`), proyecto
  en ClickUp, brief inicial.
- **Sigue →** Research (2).
- *Futuro:* skill `onboarding-cliente` que automatice el scaffolding.

## 2. Research / Discovery
**Estás aquí si:** vas a investigar mercado, competencia, keywords y audiencia (Doble Diamante F1).
- **Skills:** `/alto-house/research-workflow` (lanza 4 agentes en paralelo), `/alto-house/social-listening`.
- **Agentes:** `keyword-researcher` — lo lanza el propio `research-workflow`; no lo invoques a mano
  salvo que quieras solo el mapa de keywords.
- **MCPs:** **Similarweb** (tráfico/competencia). ECC: market-research, deep-research, research-ops.
- **Entregable:** `RESEARCH_TEMPLATE/01_DESCUBRIR.md` lleno.
- **Sigue →** Estrategia (3).

## 3. Estrategia / Definición
**Estás aquí si:** ya hay research y toca destilar diagnóstico, personas y recomendación central
(Doble Diamante F2-F3, Rúbrica Blue Ocean).
- **Skills:** `/alto-house/research-workflow` (fases 2-3), `/alto-house/market-differentiation`.
- **Agentes:** — (usa ECC `council` para evaluación multi-perspectiva y `strategic-compact` para el
  resumen ejecutivo de 1 página).
- **MCPs:** —
- **Entregable:** `02_DEFINIR.md` + `03_DESARROLLAR.md` (personas, problem statement, recomendación
  central, roadmap 90 días).
- **Sigue →** Pitch (4) o directo a ejecución.

## 4. Pitch / Venta
**Estás aquí si:** vas a presentar/vender — antes o para cerrar.
- **Skills:** `/alto-house/estrategia-light` (entregable gratuito pre-cierre), `pitch-deck-system`
  (comandos `/pitch-template-library`, `/pitch-slide-from-image`).
- **Agentes:** —
- **MCPs:** **Figma** (slides del pitch).
- **Entregable:** Estrategia Light (slides/email) o pitch deck en Figma.
- **Sigue →** Marca (5) al cerrar.

## 5. Marca / Identidad
**Estás aquí si:** vas a construir la identidad — brand book, sistema de diseño, voz.
- **Skills:** `/alto-house/brand-book` (init / intake / ideate / design-system / generate).
- **Agentes:** — (ECC `brand-voice` para tono).
- **MCPs:** **Figma** (design system + Brand Book como Slides).
- **Entregable:** Brand Book (Figma Slides) + `globals.css` + tokens.
- **Sigue →** Website (6).

## 6. Website / Build
**Estás aquí si:** vas a construir el sitio (o un CRM de cliente).
- **Skills:** workflow `brand-to-website` (vía `/alto-house/web-design-workflow`),
  `/alto-house/crm-client-delivery` para app CRM.
- **Agentes:** los del workflow (figma-clone-generator/evaluator) se orquestan solos si stack=Webflow.
- **MCPs:** **Webflow** (diseño + CMS + publicar), **Figma** (design→code), **Vercel** (deploy),
  **Framer** (alternativa de build).
- **Entregable:** sitio (HTML o frames Figma verificados) + reporte QA.
- **Sigue →** SEO (7).
- **Nota:** pasa `vertical` (real-estate/medical/product/generic) para que el workflow genere el
  schema correcto en la fase SEO.

## 7. SEO / Técnico
**Estás aquí si:** el sitio necesita schema markup, metadata, y la capa técnica antes de publicar.
- **Skills:** `/alto-house/seo-schema` (JSON-LD baseline + vertical, metadata/OG, higiene Webflow).
- **Agentes:** `seo-specialist` — **invócalo** para auditar un sitio en producción (read-only,
  taxonomía de severidad). El skill genera; el agente audita.
- **MCPs:** **Webflow** (campo Schema, `asset-audit`, `link-checker`, `accessibility-audit`).
- **Entregable:** JSON-LD aplicado + checklist de higiene corrido + reporte SEO.
- **Sigue →** Estrategia Digital (8) / Entrega (9).

## 8. Estrategia Digital / Contenido
**Estás aquí si:** vas a montar el ecosistema digital — social, reviews, WhatsApp, Doctoralia.
- **Skills:** `/alto-house/estrategia-digital` (consume el research, no lo modifica).
- **Agentes:** `marketing-agent` — **invócalo** para campañas, copy de anuncios, secuencias de
  email, guiones de video corto.
- **MCPs:** **Gmail**, **Drive** (documentar el plan). ECC: `content-engine` (producción continua),
  `crosspost` (distribución multicanal).
- **Entregable:** `ESTRATEGIA_DIGITAL.md` (Fundamentos, Social, Google Reviews, Doctoralia, WhatsApp).
- **Sigue →** Entrega (9) / Retainer (10).

## 9. Entrega / Handoff  ·  *(gap: sin skill genérico)*
**Estás aquí si:** vas a entregar un deliverable y transferir accesos.
- **Skills:** aún no hay handoff genérico. Usa el **PASO 8** de `/alto-house/crm-client-delivery`
  como plantilla (doc de accesos + training 30 min) y adáptalo al deliverable.
- **Agentes:** —
- **MCPs:** **Drive** (archivar entregables), **Gmail** (correo de entrega, como borrador),
  **ClickUp** (marcar proyecto completo).
- **Entregable:** doc de handoff + sign-off del cliente.
- **Sigue →** Retainer (10).
- *Futuro:* skill `entrega-handoff` que generalice esto a cualquier deliverable.

## 10. Retainer / Reporte / Mantenimiento  ·  *(gap: sin skill dedicado)*
**Estás aquí si:** el cliente está en retainer y toca reportar resultados y mantener.
- **Skills:** aún no hay skill dedicado. Usa ECC `dashboard-builder` (dashboard HTML) +
  `strategic-compact` (resumen ejecutivo), leyendo los KPIs baseline/target de `04_ENTREGAR.md`.
- **Agentes:** —
- **MCPs:** **GA4 + Search Console** (vía **Zapier** — datos propios del sitio), **Similarweb**
  (competencia), **Webflow** (`link-checker`/`site-audit` para mantenimiento).
- **Entregable:** reporte mensual (Docs/Notion/Figma Slides) vs. KPIs, con framing honesto
  (schema/SEO = CTR/AI, no ranking; cifras de industria como estimación).
- **Sigue →** ciclo mensual (programar con `/schedule`).
- *Futuro:* skill `retainer-ops` + MCP GA4/GSC.

---

## Reglas de enrutamiento

- **Ruta real de clientes:**
  `~/Alto House/10_Clientes/{ACTIVE|PROSPECTING|NOT CLOSED}/[cliente]/`
- Si existe `STATUS.md` en la raíz de la carpeta del cliente, **ese panel manda** — refleja el
  estado real del cliente sobre este mapa genérico. (No `GUIA_OS.md`: la plantilla nunca se adoptó;
  `STATUS.md` es el formato que sí se usa en producción.)
- **El research siempre vive en `03_Strategy Docs/Research/`** del cliente. Es la convención única;
  clientes viejos con otras rutas son deuda, no precedente.
- Antes de **escribir** en sistemas externos (ClickUp, Gmail, Drive, Webflow), confirma con el
  usuario. Los correos siempre como **borrador**.
- Los *(gap)* se enrutan al asset provisional y se dicen como tal — no se inventa un skill que no
  existe.
