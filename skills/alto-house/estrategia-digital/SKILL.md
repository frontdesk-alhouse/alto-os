---
description: "Genera la Estrategia Digital consolidada de un cliente de Alto House — ecosistema de redes sociales (pilares con rol de funnel, tono, identidad visual, plataformas, repurposing, calendario, community y manejo de mensajes), Google Reviews (setup, generación y manuales de manejo de comentarios y crisis A-Z), WhatsApp Business (setup, flujo de mensajes y secuencias de seguimiento) y Doctoralia/plataformas verticales — a partir del research ya producido en el Doble Diamante."
argument-hint: "[cliente] [ruta a la carpeta Research/ del cliente]"
---

# Alto House — Estrategia Digital

> Convierte el diagnóstico del Doble Diamante en un plan de ejecución para el ecosistema digital completo del cliente:
> Social Media (pilares, tono, identidad visual, plataformas, calendario, community, mensajes), Google Reviews (manual A-Z), WhatsApp Business (setup + secuencias) y Doctoralia/plataformas verticales.
> No repite el research — lo usa. No modifica `00_BRIEF.md`–`04_ENTREGAR.md`; lee de ahí y produce un documento nuevo, separado.

**Input**: $ARGUMENTS (nombre del cliente + ruta a su carpeta `Research/` del Doble Diamante)

---

## Cuándo activar este skill

- Después de completar (al menos) la Fase 2 del `research-workflow` — se requieren buyer personas y Rúbrica Blue Ocean como mínimo. Fase 3 (`03_DESARROLLAR.md`) es opcional pero recomendada para no contradecir la Recomendación Central.
- Cuando el cliente ya firmó y se necesita el plan operativo de redes + contenido + reputación.
- Standalone, apuntando a una carpeta `Research/` ya existente:
  ```
  /alto-house/estrategia-digital "[cliente]" "ruta/a/Research/"
  ```

## Qué NO hace este skill

- No modifica `00_BRIEF.md`, `01_DESCUBRIR.md`, `02_DEFINIR.md`, `03_DESARROLLAR.md` ni `04_ENTREGAR.md`.
- No vuelve a puntuar la Rúbrica Blue Ocean — la lee y la usa como insumo.
- No genera Estrategia Light ni pitch — eso lo cubre `alto-house/estrategia-light`.
- No define el paquete de servicio (Colorado/Sonora/Patagonia/Sahara) — eso lo cubre Fase 4 de `research-workflow`.
- No reemplaza el call center, ventas o atención al cliente general del negocio — solo define el manejo de mensajes y comentarios que llegan por los canales digitales/sociales que administra Alto House (Instagram, Facebook, Google Business Profile, Doctoralia, WhatsApp Business).

---

## Estructura del proceso

El proceso se organiza en 6 Fases que producen, en ese mismo orden, las 5 PARTES del documento final:

```
FASE A — Fundamentos              → PARTE 0 del documento
FASE B — Social Media             → PARTE 1 del documento (todo lo social junto)
FASE C — Google Reviews           → PARTE 2 del documento (standalone, manual A-Z + crisis)
FASE D — Doctoralia               → PARTE 3 del documento (standalone)
FASE E — WhatsApp Business         → PARTE 4 del documento (standalone — setup + secuencias)
FASE F — Cierre                   → PARTE 5 del documento
```

**Todas las Estrategias Digitales deben incluir la sección de WhatsApp Business** — es un canal obligatorio en el documento final, no opcional.

---

## FASE A — Fundamentos

### Paso 1 — Recolectar inputs del research existente

**Tareas:**
- Ubicar la carpeta `Research/` del cliente (Doble Diamante) — típicamente sibling de donde se guardará esta estrategia.
- Leer `00_BRIEF.md` — extraer industria/vertical, nombre, URLs, redes existentes. Determinar explícitamente si la vertical es salud/médica (activa/desactiva Doctoralia en Fase D).
- Leer `01_DESCUBRIR.md` — extraer: tono/lenguaje real de audiencia (Social Listening), patrones de contenido de competidores (formatos, frecuencia, tono — Análisis de Competencia), estado actual de redes y de Google Reviews del cliente (Audit Digital), keywords prioritarias si existen.
- Leer `02_DEFINIR.md` — extraer: buyer personas completos (incluyendo comportamiento digital/plataformas), tabla de Rúbrica Blue Ocean con puntuaciones, Problem Statement.
- Leer `03_DESARROLLAR.md` (si existe) — extraer Recomendación Estratégica Central, Acciones Tácticas por Persona y roadmap 90 días, para no contradecirlos.
- Llenar `00_INPUTS.md` del `DIGITAL_STRATEGY_TEMPLATE` con estos hallazgos, cada uno con su archivo de origen citado. No se investiga nada nuevo en este paso.

**Output esperado:** `00_INPUTS.md` completo.

**Quality Gate:**
- [ ] ¿Se leyeron los archivos disponibles del Doble Diamante (mínimo 00-02)?
- [ ] ¿Se determinó explícitamente si la vertical es salud/médica?
- [ ] ¿Cada input tiene su archivo de origen citado?

### Paso 2 — Objetivos y audiencia objetivo del ecosistema digital

**Tareas:**
- Definir objetivos SMART del ecosistema digital, ligados directamente al Problem Statement / Recomendación Central (ej. awareness en nueva ciudad, generación de leads calificados, reputación, retención).
- Reinterpretar los buyer personas de `02_DEFINIR.md` específicamente para contenido y redes: qué buscan ver, en qué plataforma están, qué los detiene de seguir/interactuar.

**Output esperado:** sección "Objetivos y Audiencia Objetivo" (PARTE 0.2).

**Quality Gate:**
- [ ] ¿Cada objetivo es medible y tiene plazo?
- [ ] ¿La audiencia está descrita en términos de comportamiento digital, no solo demográfico?

### Paso 3 — Auditoría de contenido de competencia

**Tareas:**
- Sintetizar (sin nueva investigación) qué formatos, frecuencia y tono usan los competidores ya analizados en `01_DESCUBRIR.md`.
- Identificar patrones que todos repiten y gaps de contenido que nadie está cubriendo — insumo directo para los pilares de la Fase B.

**Output esperado:** sección "Auditoría de Contenido de Competencia" (PARTE 0.3).

**Quality Gate:**
- [ ] ¿Se identificó al menos un gap de contenido no cubierto por competidores?

### Paso 4 — Estrategia general del ecosistema digital

**Tareas:**
- Describir cómo se conectan Social Media + Google Reviews + Doctoralia (si aplica) + el pipeline de conversión ya mapeado en `03_DESARROLLAR.md` (si existe) en un solo flujo.

**Output esperado:** sección "Estrategia General del Ecosistema Digital" (PARTE 0.4), con diagrama de flujo en texto.

---

## FASE B — Social Media

*Todo lo relacionado a redes sociales vive en esta fase y en la PARTE 1 del documento — un solo bloque, nada disperso.*

### Paso 5 — Pilares de contenido, tono de voz y lineamientos de escritura

**Tareas:**
- Definir 3-5 pilares de contenido derivados directamente del Problem Statement, la Recomendación Central (si existe) y los gaps del Paso 3 — no pilares genéricos de "educar, inspirar, vender".
- **Para cada pilar, definir:**
  - **Objetivo en el funnel:** Awareness / Consideración / Conversión / Retención.
  - **Rol específico:** qué hace exactamente (educar, entretener, generar confianza, activar venta, fidelizar, etc.).
  - **% de mix:** qué proporción del contenido total representa este pilar. Los porcentajes de todos los pilares deben sumar 100%.
  - Formatos por pilar (video corto, carrusel, testimonial, detrás de cámaras, educativo, UGC, etc.) y a qué buyer persona sirve.
- Definir tono de voz con base en: (a) cómo habla la audiencia real en Social Listening, (b) el diferenciador de la Rúbrica Blue Ocean, (c) cómo NO hablan los competidores.
- Definir lineamientos de escritura: estructura de caption por tipo de post, fórmulas de hooks/primeras líneas, uso de emojis, estrategia de hashtags (branded / de nicho / de alcance), CTAs por objetivo de post, longitud recomendada por plataforma.

**Output esperado:** secciones "Pilares de Contenido" (con tabla que incluye objetivo de funnel, rol y % de mix), "Tono de Voz" y "Lineamientos de Escritura" (PARTE 1.1-1.3).

**Quality Gate:**
- [ ] ¿Cada pilar cita el hallazgo de research que lo justifica?
- [ ] ¿Cada pilar tiene objetivo de funnel, rol específico y % de mix, y los porcentajes suman 100%?
- [ ] ¿El tono de voz usa lenguaje real extraído de Social Listening, no lenguaje de marketing genérico?

### Paso 6 — Identidad visual para contenido

**Tareas:**
- Fotografía: estilo, luz, composición, qué SÍ y qué NO.
- Video: formato (reels/shorts), duración, subtítulos, gancho en los primeros 3 segundos.
- Diseño gráfico: uso de logo, paleta de color, tipografía, plantillas recomendadas.
- Esta identidad se construye SIEMPRE sobre la marca ya existente del cliente (logo/paleta/fotografía auditados en `01_DESCUBRIR.md`) — nunca inventa una identidad nueva ni contradice la marca ya establecida.

**Output esperado:** sección "Identidad Visual para Contenido" (PARTE 1.4).

**Quality Gate:**
- [ ] ¿Los lineamientos visuales referencian la identidad de marca ya existente del cliente, no una inventada?

### Paso 7 — Estrategia por plataforma social

**Tareas:**
- Seleccionar plataformas prioritarias (máximo 3-4) con justificación basada en dónde está el buyer persona principal (comportamiento digital de `02_DEFINIR.md`).
- **Para cada plataforma, declarar su objetivo y rol específico en el funnel** — no solo "por qué la elegimos" sino qué hace bien y qué no hace bien estructuralmente esa red. Usar como lente de referencia (ajustable si el research del cliente lo contradice):

  | Plataforma | Descubrimiento orgánico | Rol típico en el funnel |
  |---|---|---|
  | Instagram | Alto (Explore/Reels/hashtags/pauta) | Top-of-funnel — capta cuentas nuevas |
  | Facebook | Bajo (el feed prioriza contactos/grupos) | Retención, comunidad, audiencia más madura — no es motor de descubrimiento |
  | TikTok | Muy alto (For You Page algorítmico) | Top-of-funnel masivo, awareness viral |
  | LinkedIn | Bajo pero de alta intención | Autoridad/confianza B2B, mid-funnel |
  | WhatsApp Business | No aplica (no es descubrimiento) | Conversión y retención directa |

- Explicar explícitamente qué plataformas se descartan y por qué.
- Definir cómo cada plataforma conecta al pipeline digital (WhatsApp/formulario/booking) ya mapeado en `03_DESARROLLAR.md` si existe.
- **Repurposing de contenido entre plataformas:** definir cuál es la plataforma "madre" (donde se crea el contenido nativo), qué formatos se duplican 1:1, cuáles se adaptan (recorte, subtítulos, copy reescrito) y cuáles no aplican a cada plataforma. Formato de matriz: Formato de contenido × Plataforma → Nativo / Duplicado 1:1 / Adaptado / No aplica.

**Output esperado:** sección "Estrategia por Plataforma" con tabla (plataforma / rol en el funnel / por qué / frecuencia / formato dominante / conecta a) + sub-sección "Repurposing de Contenido entre Plataformas" con la matriz (PARTE 1.5-1.6).

**Quality Gate:**
- [ ] ¿Cada plataforma elegida declara su rol específico en el funnel con criterio real, no solo intuición?
- [ ] ¿Se explica qué plataformas NO se recomiendan y por qué?
- [ ] ¿Existe la matriz de repurposing y queda claro qué se duplica, qué se adapta y qué no aplica?

### Paso 8 — Calendario inicial (30 días) y plan 60-90 días

**Tareas:**
- Calendario de 30 días semana por semana: pilar, plataforma, formato, tema/idea. La proporción de apariciones de cada pilar debe reflejar su % de mix definido en el Paso 5.
- Plan de 60 y 90 días a nivel de cadencia/foco (qué cambia, qué se optimiza, qué se agrega — ej. mes 2 se activa Doctoralia si aplica).
- Cruzar contra el roadmap de 90 días de `03_DESARROLLAR.md` si existe, sin contradecirlo.

**Output esperado:** "Calendario Inicial (30 días)" y "Plan 60-90 Días" (PARTE 1.7-1.8).

**Quality Gate:**
- [ ] ¿El calendario cubre todas las plataformas del Paso 7?
- [ ] ¿Cada pilar aparece en proporción a su % de mix?

### Paso 9 — Community Management, mensajes, crisis y gobernanza (canal social)

**Tareas:**
- **Taxonomía de mensajes entrantes** (DMs + comentarios) en 3 categorías, cada una con dueño y SLA:
  - **Genéricos/informativos** (horario, ubicación, precio base, FAQ) → Alto House responde directo con plantilla predefinida, SLA mismo día.
  - **Consultas que Alto House puede resolver** con información ya pública o ya definida en este documento/research → Alto House responde con criterio, sin comprometer al cliente en temas que no le corresponden.
  - **Leads calificados / intención de compra / información sensible** (negociación de precio, quejas, temas legales o médicos) → Alto House NO responde a nombre del cliente, escala de inmediato.
- **Flujo de escalación y handoff de leads al equipo interno del cliente:** cómo se identifica un lead calificado, por qué canal se pasa (mismo pipeline mapeado en el Audit Digital), qué información mínima viaja en el traspaso (contexto de la conversación, plataforma de origen, urgencia), tiempo máximo para ejecutar el handoff, y quién de Alto House es responsable.
- **Comunidad**, más allá de contestar mensajes privados: cómo se interactúa con comentarios en contenido propio, con qué cuentas aliadas/aspiracionales conviene interactuar, estrategia de UGC/resharing, cómo se fomenta conversación real (preguntas en captions, encuestas).
- **Protocolo de crisis y comentarios negativos en redes** (distinto del protocolo de Google Reviews de la Fase C — este es específicamente para comentarios/DMs/menciones en redes sociales): qué se considera crisis vs. comentario negativo aislado, quién autoriza una respuesta pública en situación sensible, tiempo máximo de primera respuesta pública.
- **Roles y flujo de aprobación de contenido:** quién en Alto House publica, quién en el cliente aprueba (si aplica), tiempo de aprobación esperado, qué contenido requiere aprobación previa vs. cuál se publica directo.

**Output esperado:** sección "Community Management, Mensajes, Crisis y Gobernanza" (PARTE 1.9-1.12), con tabla de clasificación de mensajes y tabla de roles/aprobación.

**Quality Gate:**
- [ ] ¿Las 3 categorías de mensajes tienen SLA y responsable definidos?
- [ ] ¿El flujo de handoff especifica canal, información mínima, tiempo máximo y responsable?
- [ ] ¿La estrategia de comunidad va más allá de "contestar mensajes" (incluye engagement propio y moderación)?
- [ ] ¿El protocolo de crisis distingue una crisis real de un comentario negativo aislado?
- [ ] ¿Los roles de aprobación de contenido están definidos para Alto House y para el cliente?

---

## FASE C — Google Reviews

*Sección standalone — no se mezcla con Social Media ni con Doctoralia. Manual operativo completo, de la A a la Z.*

### Paso 10 — Google Business Profile / Tarjeta Digital

**Tareas:**
- Auditar estado actual (si `01_DESCUBRIR.md` ya tiene cantidad/calificación de reseñas, reusar ese dato).
- Definir setup recomendado: categoría principal y secundarias, horarios, fotos requeridas, descripción con keywords prioritarias (de `01_DESCUBRIR.md` si existen), área de servicio.

**Output esperado:** sección "Google Business Profile / Tarjeta Digital — Setup" (PARTE 2.1).

### Paso 11 — Manual de Generación y Manejo de Reviews (de la A a la Z)

**Tareas:**
- **Generación de reviews:** mecanismo físico y/o digital concreto (letrero en oficina, QR, tarjeta física, código de descuento/incentivo si aplica), en qué momento exacto del customer journey se pide, quién lo pide (recepción, ejecutivo de venta, seguimiento automatizado), canal de seguimiento (WhatsApp/email post-servicio), frecuencia objetivo mensual. No dejar en "pedir reviews" genérico — el mecanismo debe ser accionable y específico al negocio del cliente.
- **Manual de manejo de comentarios/reviews en general:** qué pasa cuando llega un review nuevo (positivo, neutral, o negativo leve) — quién lo ve primero, quién responde, con qué tono, en qué tiempo máximo, con qué estructura de respuesta (plantilla base + personalización).
- **Manual de manejo de crisis** (separado del manual general): qué califica como situación de crisis (review negativo grave, ataque coordinado, tema legal o de seguridad) vs. un comentario negativo aislado ya cubierto en el manual general; quién autoriza la respuesta pública; protocolo de escalación interna; tiempo máximo de primera respuesta en crisis; seguimiento posterior (¿se contacta al cliente insatisfecho fuera de la plataforma?).

**Output esperado:** secciones "Estrategia de Generación de Reviews", "Manual de Manejo de Comentarios y Reviews" y "Manual de Manejo de Crisis" (PARTE 2.2-2.4), cada una con su tabla de protocolo (tipo de situación / quién responde / tiempo / tono / responsable).

**Quality Gate:**
- [ ] ¿El mecanismo de generación de reviews es concreto y accionable (no "pedir reviews")?
- [ ] ¿El manual general y el manual de crisis están claramente diferenciados (uno para lo cotidiano, otro para lo grave)?
- [ ] ¿Ambos manuales dicen explícitamente quién responde y en cuánto tiempo?

---

## FASE D — Doctoralia

*Sección standalone — siempre presente en el documento, aunque el resultado sea "no aplica".*

### Paso 12 — Doctoralia y otras plataformas de reputación vertical

**Tareas:**
- Determinar explícitamente si la vertical del cliente es salud/médica (doctores, clínicas, dentistas, medicina estética, etc., según `00_BRIEF.md`).
- **Si aplica:** definir setup de perfil en Doctoralia, verificación profesional, estrategia de generación de reseñas de pacientes, uso del sistema de citas de Doctoralia si el cliente lo utiliza.
- **Si NO aplica:** marcar la sección explícitamente como `N/A — vertical no aplica` con la razón. Nunca omitir la sección completa.
- Evaluar si existe alguna otra plataforma vertical relevante para el giro del cliente (ej. TripAdvisor para hospitalidad/restaurantes, Houzz para diseño/arquitectura, Clutch/G2 para servicios B2B) — documentar solo si aplica; si no hay ninguna evidente, dejar la fila como `N/A`.

**Output esperado:** secciones "¿Aplica al cliente?", "Setup de Perfil Doctoralia", "Estrategia de Generación de Reseñas" y "Otras Plataformas de Reputación Vertical" (PARTE 3), cada una resuelta (aplica + estrategia, o `N/A` con razón).

**Quality Gate:**
- [ ] ¿Se determinó explícitamente si la vertical es salud, con evidencia de `00_BRIEF.md`?
- [ ] ¿Doctoralia está marcado como aplicable con estrategia, o como N/A con razón — nunca omitido?
- [ ] ¿Se evaluó si existe alguna otra plataforma vertical relevante, aunque la conclusión sea N/A?

---

## FASE E — WhatsApp Business

*Sección standalone — obligatoria en todas las Estrategias Digitales, no opcional. WhatsApp suele ser el canal de mayor intención (el usuario ya decidió escribir directo, no solo comentar) y el punto de conversión final al que llegan Social Media, Google Reviews y Doctoralia.*

### Paso 13 — WhatsApp Business: setup, flujo de mensajes y secuencias de seguimiento

**Tareas:**
- **Setup del perfil de WhatsApp Business:** nombre, categoría, foto, descripción, horario de atención, ubicación si aplica, catálogo de servicios si aplica.
- **Mensajes automatizados base:** mensaje de bienvenida (primer contacto) y mensaje de ausencia (fuera de horario), con el mismo tono de voz definido en el Paso 5 — no genérico de plantilla de WhatsApp Business por default.
- **Respuestas rápidas (quick replies):** para las preguntas genéricas más frecuentes, con el mismo criterio de clasificación de mensajes usado en el Paso 9, adaptado a este canal.
- **Flujo de mensajes y protocolo de respuesta específico para WhatsApp:** por ser el canal de mayor intención, el SLA debe ser igual o más agresivo que el de redes sociales del Paso 9. Aplica la misma regla de fondo: ningún tema sensible, técnico o de riesgo (legal, médico, financiero según el giro del cliente) se resuelve por chat — se escala según el mismo flujo de handoff del Paso 9, adaptado a este canal.
- **Secuencias de seguimiento** (solo si son consistentes con lo que el cliente está dispuesto a hacer — nunca invasivas ni spam): confirmación de cita/pedido, recordatorio previo, seguimiento posterior al servicio. Siempre basadas en opt-in explícito del usuario, nunca mensajes masivos no solicitados — respeta la política de uso de WhatsApp Business y evita quejas de spam que puedan suspender el número.
- **Integración con el resto del ecosistema:** definir explícitamente cómo cada canal (Social Media, Google Reviews, Doctoralia) conecta hacia WhatsApp como punto de conversión, y qué pasa exactamente cuando el mensaje llega ahí.

**Output esperado:** sección "WhatsApp Business" completa (PARTE 4), con setup de perfil, tabla de clasificación/SLA específica de WhatsApp, secuencias de seguimiento y su integración con el resto del ecosistema.

**Quality Gate:**
- [ ] ¿El perfil tiene mensaje de bienvenida y de ausencia definidos, consistentes con el tono de voz del Paso 5?
- [ ] ¿El SLA de WhatsApp es igual o más agresivo que el de redes sociales (es el canal de mayor intención)?
- [ ] ¿Las secuencias de seguimiento son opt-in y no invasivas, no mensajes masivos no solicitados?
- [ ] ¿Queda explícito cómo cada canal previo (Social Media, Google Reviews, Doctoralia) conecta hacia WhatsApp?

---

## FASE F — Cierre

### Paso 14 — KPIs, herramientas y consolidación final

**Tareas:**
- KPIs por plataforma/canal (Social Media, Google Reviews, Doctoralia si aplica, WhatsApp) con baseline real + meta a 90 días y frecuencia de reporte.
- Stack de herramientas recomendado (programación de posts, diseño, analítica, WhatsApp Business) — recomendaciones ligeras, consistentes con el posicionamiento de "operaciones ligeras" de Alto House, sin infraestructura pesada.
- Copiar `templates/DIGITAL_STRATEGY_TEMPLATE/ESTRATEGIA_DIGITAL.md` a la carpeta del cliente (si aún no existe) y llenar cada sección con los outputs de los Pasos 1-13, respetando la separación en 5 PARTES.
- Completar la tabla "Cómo la Rúbrica Blue Ocean informa esta estrategia" — cruzar los criterios de la Rúbrica contra las decisiones tomadas en las Fases B-E (ej. "Criterio 5 — Facilidad Primer Contacto tuvo puntuación baja → la estrategia de mensajes prioriza SLA agresivo y CTA de WhatsApp en cada plataforma").
- Marcar cualquier claim sin fuente con `[inferencia]`, y cualquier dato con más de 2 años con `[dato desactualizado]`.
- Correr el Quality Gate Final.

**Output esperado:** `ESTRATEGIA_DIGITAL.md` completo en la carpeta del cliente, listo para revisión interna y entrega.

---

## Quality Gate Final — Estrategia Digital

- [ ] ¿Las 5 PARTES del documento están claramente separadas, sin contenido mezclado entre ellas?
- [ ] ¿Todos los pilares de contenido citan evidencia y tienen objetivo de funnel, rol y % de mix (sumando 100%)?
- [ ] ¿El tono de voz refleja lenguaje real de Social Listening, no lenguaje de marketing genérico?
- [ ] ¿Cada plataforma social declara su rol en el funnel con criterio real, y existe la matriz de repurposing?
- [ ] ¿Se explicaron las plataformas descartadas y por qué?
- [ ] ¿La sección de mensajes/comunidad tiene las 3 categorías con SLA, el flujo de handoff, la estrategia de comunidad y el protocolo de crisis en redes?
- [ ] ¿Google Reviews tiene los tres bloques completos y diferenciados: setup, generación A-Z, manual general, y manual de crisis?
- [ ] ¿Doctoralia está resuelto explícitamente — aplicable con estrategia, o N/A con razón?
- [ ] ¿WhatsApp Business tiene setup, mensajes de bienvenida/ausencia, flujo de mensajes con SLA, secuencias opt-in, e integración explícita con los demás canales?
- [ ] ¿El calendario de 30 días cubre todos los pilares (en proporción a su % de mix) y todas las plataformas seleccionadas?
- [ ] ¿El plan 60-90 días es consistente con el roadmap de `03_DESARROLLAR.md` si existe?
- [ ] ¿La tabla de cruce con la Rúbrica Blue Ocean está completa e interpretada, no solo copiada?
- [ ] ¿Toda afirmación tiene fuente o está marcada `[inferencia]`? ¿Los datos viejos están marcados `[dato desactualizado]`?
- [ ] ¿El documento NO modificó ningún archivo de `Research/` del Doble Diamante?

---

## Dónde se guarda el output

Este skill produce su output en una carpeta **hermana** a la carpeta `Research/` del cliente, nunca dentro de ella:

```
[Cliente]/
├── Research/                    ← Doble Diamante (NO se toca)
│   ├── 00_BRIEF.md
│   ├── 01_DESCUBRIR.md
│   ├── 02_DEFINIR.md
│   ├── 03_DESARROLLAR.md
│   └── 04_ENTREGAR.md
└── Estrategia_Digital/          ← output de este skill
    ├── 00_INPUTS.md
    └── ESTRATEGIA_DIGITAL.md
```

**Al iniciar un cliente nuevo:**
```bash
cp -r templates/DIGITAL_STRATEGY_TEMPLATE/ \
  ~/Library/Mobile\ Documents/com~apple~CloudDocs/"Alto House"/clientes/[CLIENTE]/Estrategia_Digital/
```

**Durante prospección (antes de firmar contrato):**
```bash
cp -r templates/DIGITAL_STRATEGY_TEMPLATE/ \
  ~/Library/Mobile\ Documents/com~apple~CloudDocs/"Alto House"/10_Clientes/PROSPECTING/[CLIENTE]/Estrategia_Digital/
```

---

## Cómo usar este skill

```
/alto-house/estrategia-digital "[cliente]" "ruta a su carpeta Research/"

Ejemplo:
/alto-house/estrategia-digital "Casa Nogal" "10_Clientes/PROSPECTING/Casa Nogal/Research/"
/alto-house/estrategia-digital "Dra. Estephania Navarro" "10_Clientes/PROSPECTING/Dra. Estephania Navarro/Research/"
```

---

## Integración con otros skills de Alto House

- **Input principal** — lee (sin modificar) `01_DESCUBRIR.md`, `02_DEFINIR.md` y `03_DESARROLLAR.md` producidos por `alto-house/research-workflow`. Requiere mínimo Fase 2 completa (buyer personas + Rúbrica Blue Ocean); Fase 3 es opcional pero recomendada para no contradecir la Recomendación Central.
- **No depende de ni modifica** `alto-house/estrategia-light` (entregable de venta pre-cierre) ni `alto-house/market-differentiation` (aunque puede reusar su Mapa de Diferenciación si ya existe).
- **Después de este skill** → `alto-house/crm-client-delivery` puede usar los pilares de contenido, las plataformas y el flujo de handoff de leads definidos aquí para configurar fuentes de leads en el CRM del cliente.
- **Skills ECC recomendados durante la ejecución:**
  - `brand-voice` — para profundizar la definición de tono de voz del Paso 5.
  - `content-engine` — para producir el primer lote real de contenido del calendario de 30 días.
  - `council` — opcional, para evaluar la selección de plataformas y pilares con perspectivas múltiples antes de finalizar.

---

*Alto House × Claude Code | Estrategia Digital*
