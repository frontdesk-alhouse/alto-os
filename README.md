# Alto House OS

El sistema operativo con el que **Alto House** hace brand management y posicionamiento: research, estrategia, marca, sitio web, SEO, medición y entrega, operados con agentes de IA sobre [Claude Code](https://claude.com/claude-code).

No es una colección de prompts. Es la metodología de la agencia escrita como skills, agentes y comandos: cada etapa del cliente tiene un procedimiento, un instrumento que mide el resultado y un punto donde decide una persona.

> **EN** — Alto House's agency operating system: the full client workflow (research → strategy → brand → website → SEO → measurement → delivery) encoded as Claude Code skills, subagents and commands. One entry point (`/ah`), parallel research agents, deterministic scorers instead of self-grading, cross-model verification, and explicit human gates. Docs are in Spanish.

---

## Cómo usamos la IA

**1. Una sola entrada.** `/ah [cliente] — [lo que quieres lograr]`. El despachador no pregunta en qué etapa vas: lo deduce leyendo la carpeta del cliente (qué fases del research existen, si hay brand book, copy, reportes) y propone el plan con el skill, el agente y la herramienta de cada paso.

**2. Agentes en paralelo, cada uno con un carril.** El research corre sus carriles como subagentes independientes: auditoría digital (A), competencia (B), keywords y saturación (C), demanda B2B o escucha social B2C (D, los dos si el cliente atiende ambos segmentos) y visibilidad en asistentes de IA (F). Cada uno escribe su informe crudo con fuentes; la síntesis no la hace el mismo que recolectó.

**3. Datos antes que intuición.** La estrategia sale de la **Rúbrica Blue Ocean**: siete criterios de valor del sector calificados para el cliente y sus competidores. Donde toda la industria falla está el espacio a ocupar, y la Recomendación Estratégica Central tiene que citar esos criterios.

**4. Un modelo no se califica a sí mismo.** Donde hay que construir con fidelidad (Figma, Webflow, Framer) el bucle es generador ↔ evaluador, y el evaluador es un instrumento determinista (captura con Playwright, diff de píxeles, gates con casos rotos que prueban que saben fallar), no la opinión del mismo modelo que construyó.

**5. Verificación cruzada entre modelos.** Claude decide y sintetiza; otro modelo (Codex o Gemini) audita a ciegas y sin ver la respuesta del primero. Se comparan los dos informes. Ver [`docs/codex-playbook.md`](docs/codex-playbook.md).

**6. Puertas humanas que no se saltan.** Dirección de marca, copy que entra al sitio del cliente (un hook bloquea la escritura sin aprobación), publicar a producción, y cualquier escritura en sistemas externos: los correos salen como borrador.

**7. Se mide, no se promete.** El SEO técnico gana elegibilidad, no ranking; la citación en ChatGPT o Gemini se mide con corridas repetidas, no se garantiza. Los entregables llevan KPIs con línea base real y las condiciones que dependen del cliente.

**8. El sistema aprende de sus errores.** Cuando una persona ve un defecto que el instrumento dejó pasar, primero se extiende el instrumento y se comprueba que ahora falla; después se arregla. Así cada error se convierte en un gate permanente.

---

## El flujo completo

| # | Etapa | Qué hace la IA | Qué decide una persona | Skills / agentes |
|---|---|---|---|---|
| 1 | Onboarding | Crea la estructura del cliente y el brief a partir de la conversación inicial | Alcance y paquete | `/ah`, `os-router`, `templates/` |
| 2 | Research | Carriles en paralelo con fuentes verificadas; teardown de landings | Qué carriles aplican (B2B, B2C o ambos) | `research-workflow`, agentes `ah-*`, `landing-teardown`, `saas-competitive-analyst`, `social-listening` |
| 3 | Estrategia | Rúbrica Blue Ocean, saturación de keywords, Recomendación Central | La recomendación final | `market-differentiation`, `research-workflow` (fases 2–3) |
| 4 | Pitch | Estrategia Light gratuita y deck en Figma desde templates con contrato de fidelidad | Qué se presenta | `estrategia-light`, `pitch-deck-system`, `/pitch-template-library`, `/pitch-slide-from-image` |
| 5 | Marca | Intake de voz y personalidad, conceptos, design system en Figma | Dirección de marca (no delegable) | `brand-book`, `nano-banana` |
| 6 | Sitio web | Design system → sitemap → copy → SEO → build → QA, en fases paralelas; porte medido a Webflow o Framer | Copy aprobado, publicar | `web-design-workflow`, `brand-to-website`, `clone-to-framer`, [clone-to-webflow](https://github.com/frontdesk-alhouse/clone-to-webflow-skill), [clone-to-figma](https://github.com/frontdesk-alhouse/clone-to-figma-skill) |
| 7 | SEO y GEO | JSON-LD, metadata, robots para bots de IA, llms.txt, medición de citación | Gate de lanzamiento | [seo-geo](https://github.com/frontdesk-alhouse/seo-geo-skill), agente `ah-ai-visibility` |
| 8 | Medición y anuncios | Eventos en GA4, UTMs, auditoría de campañas Google/Meta, costo por lead objetivo desde el margen | Presupuesto y reglas de pausa | `conversion-medicion`, `anuncios-eficiencia` |
| 9 | Estrategia digital | Pilares de contenido, reseñas, WhatsApp, plataformas verticales | Tono y calendario | `estrategia-digital` |
| 10 | Entrega y retainer | CRM a la medida, entregables legibles por cualquier agente, video editado en Final Cut | Entrega final | `crm-client-delivery`, `entregable-legible`, `edit-style-extract`, `edit-style-apply`, [video-use (fork)](https://github.com/frontdesk-alhouse/video-use) |

---

## Qué hay en este repo

```
commands/
  ah.md                      despachador: una entrada para las 10 etapas
  pitch-template-library.md  construye la librería de templates de pitch en Figma
  pitch-slide-from-image.md  genera una slide desde una imagen de referencia
skills/alto-house/           la metodología
  os-router/                 mapa de etapas → skill + agente + herramienta
  research-workflow/         Double Diamond 2.0 con Rúbrica Blue Ocean
  social-listening/  market-differentiation/  estrategia-light/  estrategia-digital/
  brand-book/  pitch-deck-system/  web-design-workflow/  crm-client-delivery/
  anuncios-eficiencia/       auditoría de Google Ads y Meta (scripts + tests)
  conversion-medicion/       medición de conversión en Webflow, Framer o HTML (scripts)
skills/                      producción
  brand-to-website/          lanza el workflow multi-agente de sitio
  clone-to-framer/           Figma → Framer con el motor de paridad de clone-to-webflow
  entregable-legible/        gemelo Markdown de cada entregable HTML
  edit-style-extract/  edit-style-apply/   estilo de edición de un video → Final Cut
  nano-banana/               motor de render de imagen (Gemini CLI)
agents/                      carriles del research y analistas
workflows/brand-to-website.js   orquestación por fases con agentes en paralelo
templates/                   research, estrategia digital y panel por cliente
docs/codex-playbook.md       cómo se reparte el trabajo entre Claude y Codex
```

### Repos hermanos (públicos)

| Repo | Qué es |
|---|---|
| [seo-geo-skill](https://github.com/frontdesk-alhouse/seo-geo-skill) | SEO técnico, schema y GEO para cualquier plataforma, en español e inglés |
| [clone-to-webflow-skill](https://github.com/frontdesk-alhouse/clone-to-webflow-skill) | Figma → Webflow con scorer determinista, gates y playbook por bandas (incluye responsive-webflow) |
| [clone-to-figma-skill](https://github.com/frontdesk-alhouse/clone-to-figma-skill) | Sitio en vivo → Figma con bucle generador/evaluador |
| [panel-de-marca](https://github.com/frontdesk-alhouse/panel-de-marca) | Panel de marketing local para agencias, con Claude integrado |
| [video-use (fork)](https://github.com/frontdesk-alhouse/video-use) | Edición de video con agentes, con salida nativa a Final Cut Pro |

---

## Stack

- **Orquestación:** Claude Code (skills, subagentes, comandos, workflows, hooks).
- **Herramientas conectadas por MCP:** Figma, Webflow, Framer, Chrome (navegación real para research y QA), ClickUp, Notion, Google Drive, Gmail, Calendar, Similarweb, Apify.
- **Otros modelos:** Codex (auditoría adversarial y volumen), Gemini CLI (render de imagen y segunda opinión), whisper.cpp local (transcripción).
- **Instrumentos:** Playwright + pixelmatch (paridad visual), scripts Python sin dependencias (medición, anuncios), Final Cut Pro vía SpliceKit.

---

## Instalación

```bash
git clone https://github.com/frontdesk-alhouse/alto-os.git
cd alto-os
bash install.sh
```

Copia skills, agentes, comandos y el workflow a `~/.claude/`. Después, en Claude Code:

```
/ah Casa Nogal — arranca el research
```

**Dependencias que no están en este repo** (son de terceros): [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) (`council`, `strategic-compact`, `market-research`, `deep-research`, `research-ops`, `brand-voice`, `content-engine`), los skills oficiales de Figma, y los repos hermanos de arriba. `nano-banana` necesita Gemini CLI con la extensión nanobanana; los skills de video necesitan Final Cut Pro con SpliceKit.

Las rutas de clientes asumen `~/Alto House/10_Clientes/{ACTIVE,PROSPECTING,NOT CLOSED}/`; cámbialas en `commands/ah.md` si usas otra carpeta.

---

## Sobre los ejemplos

Los casos reales que dieron origen a cada regla están anonimizados como *Cliente A–E*; «Casa Nogal» y «Dr. García» son ficticios. Las cifras y fechas se conservan porque son la evidencia de por qué existe cada regla.

## Equipo

- **Javi De León** — Co-founder · Dirección creativa y estrategia
- **Diana Arreola** — Co-founder · Operaciones

## Licencia

MIT — ver [LICENSE](LICENSE).
