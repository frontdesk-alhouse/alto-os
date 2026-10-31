---
description: "Full Alto House Double Diamond 2.0 — investigación paralela, Rúbrica Blue Ocean, Recomendación Estratégica Central anclada en datos, entregables de pitch y Estrategia Light"
argument-hint: "[client name] [industry/niche]"
---

# Alto House — Research Workflow (Double Diamond 2.0)

> Framework de investigación completo para cualquier cliente nuevo de Alto House.
> La estrategia emerge de los datos de la Rúbrica Blue Ocean, no de intuición.
>
> Produce: análisis de mercado, Rúbrica Competitiva, Buyer Personas, Recomendación Estratégica Central,
> Estrategia Light, primer contenido, pitch preparado.

**Input**: $ARGUMENTS (nombre del cliente e industria)

---

## Contexto

Alto House es una agencia de growth con cuatro paquetes de servicio:
- **Colorado** ($27,563/mes equiv.) — Negocios nuevos o sin presencia digital
- **Sonora** ($36,771/mes equiv.) — Negocios operando bien, imagen no refleja calidad
- **Patagonia** ($82,271/mes equiv.) — Delegación completa a un partner estratégico
- **Sahara** (base reducida + comisiones) — Negocios con potencial alto que Alto House quiere apoyar a resultados

La pregunta más frecuente del cliente es: **"¿Cómo me voy a diferenciar yo?"**
Este workflow la responde con evidencia cuantificada, no con opiniones.

---

## FASE 1 — DESCUBRIR (4 agentes en paralelo)

**Objetivo:** Investigación amplia y sin filtros. 4 agentes trabajan simultáneamente.

> Lanzar los 4 agentes en paralelo en un solo mensaje. No esperar que uno termine para lanzar el siguiente.

```
Lanzar en paralelo (máximo 4 — es el techo de la cuenta):
  Agente A — Digital Audit        → ah-digital-auditor
  Agente B — Competitive Intel    → ah-competitive-intel
  Agente C — Keyword Research     → ah-keyword-mapper
  Agente D — según el comprador:
      B2C (persona)     → ah-social-listener
      B2B (empresa/gob) → ah-demand-intel
```

**La elección del carril D es la única decisión del lanzamiento.** ¿Quién le compra al cliente?
Persona física → B2C. Constructoras, industria, gobierno o corporativos → **B2B**. Ante la duda,
pregunta: es lo único que no se deduce de la carpeta del cliente.

Cada agente escribe a `Research/_raw/agente-{a,b,c,d}.md` y devuelve solo un resumen — el cuerpo se
queda en disco. La consolidación en `01_DESCUBRIR.md` **la hace la sesión principal, no un agente**:
requiere resolver contradicciones entre carriles y cruzar convergencias, que es trabajo de criterio.

---

### Agente A — Digital Audit del Cliente

**Skills/agentes:** `seo-specialist` + `marketing-agent`

**Tareas:**
- Core Web Vitals del sitio del cliente: LCP, INP, CLS (vía PageSpeed Insights)
- Meta tags: ¿tiene title, description, schema markup? ¿están bien escritos?
- Sitemap: ¿existe y funciona correctamente?
- Historial de anuncios activos e históricos: **Meta Ads Library** + **Google Ads Transparency Center** (ambos públicos y gratuitos — buscar por nombre de marca)
- Blog: ¿existe? ¿con qué frecuencia publica? ¿keywords orgánicas actuales?
- Pipeline visible: desde las redes sociales ¿a dónde lleva el CTA? ¿existe WhatsApp, formulario, booking? ¿qué tan fácil es el primer contacto?
- Redes sociales del cliente: seguidores, frecuencia de posts, engagement estimado, calidad de contenido, uso de video

**Output esperado:** sección "Audit Digital del Cliente" en `01_DESCUBRIR.md`

---

### Agente B — Inteligencia Competitiva

**Skills/agentes:** `market-research` + `deep-research`

**Tareas:**
- Web scraping de 3-5 competidores locales más relevantes
- 2-3 referentes nacionales o internacionales del mismo segmento (foco: marketing, experiencia de cliente, contenido digital — qué adaptar al mercado mexicano)
- Para cada competidor: propuesta de valor real (no copy de su web), CTA visible, precios o rangos si los publican, storytelling, presencia en redes
- Google Reviews del cliente + competidores principales: mínimo 20-30 reseñas por cada uno — extraer lenguaje real, objeciones reales, lo que más valoran
- Historial de anuncios de competidores en Meta Ads Library + Google Ads Transparency
- Menciones del cliente en prensa local/nacional (noticias, entrevistas, controversias)
- **Contexto de mercado con datos duros:** tendencias del sector en México/LATAM, indicadores económicos de la ciudad/región, crecimiento del segmento. Cada dato con fuente + fecha. Fuentes típicas: INEGI, BBVA Research, IMCO, informes sectoriales

**Output esperado:** secciones "Análisis de Competencia", "Menciones y Reputación", "Contexto de Mercado" en `01_DESCUBRIR.md`

---

### Agente C — Investigación de Keywords

**Skills/agentes:** `keyword-researcher`

```
keyword-researcher:
- Negocio: [cliente]
- Industria: [industria]
- Ciudad: [ciudad/región]
- Objetivo: identificar dónde está saturado el mercado y dónde hay oportunidades sin explotar
```

**Output esperado:**
- Tabla de keywords por volumen e intención (informacional / transaccional / comercial)
- Keywords saturadas (alta competencia)
- Keywords con oportunidad (volumen real, competencia baja)
- Tendencias 30 días por categoría
- Mapa de 4 cuadrantes: Rojo (saturado) / Verde (oportunidad) / Amarillo (trampa) / Azul (nicho)
- Calendario de contenido inicial 30 días

**Output esperado:** sección "Keywords y Saturación" en `01_DESCUBRIR.md`

---

### Agente D — Social Listening

**Skills/agentes:** `social-listening` + `research-ops`

```
/alto-house/social-listening "[industria del cliente]" "[ciudad/mercado]" full
```

**Tareas:**
- Conversaciones reales en Reddit, foros, comunidades: ¿qué dice la gente sobre este tipo de negocio/servicio?
- Objeciones no filtradas — las que nadie menciona en una junta pero sí en internet
- Lenguaje literal de la audiencia (frases exactas, palabras que usan para describir el problema o la solución)
- Qué marcas/competidores menciona la gente y por qué
- Temas emergentes sin competidor posicionado aún

**Output esperado:** sección "Social Listening" en `01_DESCUBRIR.md`

---

### Carril F (opcional): Visibilidad en asistentes de IA

**Agente:** `ah-ai-visibility` · **Skill:** `ah-seo-geo` (protocolo en `references/medicion-citacion.md`)

**Cuándo lanzarlo:** el cliente ya aparece en asistentes de IA, es YMYL (médico, legal, financiero)
o compite en una categoría angosta donde una sola fuente decide quién sale. Si no se cumple
ninguna, no se lanza.

**Cómo encaja con el techo de 4:** no corre junto a A-D; se lanza al terminar la primera tanda (usa
los competidores del carril B) o sustituye a un carril que no aplique.

**Tareas:**
- Batería de prompts fija (sin marca, con marca, el tercero que busca), N=3 por consulta y asistente
- Índice de Citación sin marca por asistente, como rango; la consulta de marca aparte
- Censo de fuentes con cada URL citada verificada; cifras erróneas pegadas al nombre

**Output esperado:** `Research/_raw/agente-f.md` y las corridas en `Research/_raw/corridas/`;
sección "Visibilidad en asistentes de IA" en `01_DESCUBRIR.md`

---

### Consolidación de Fase 1

Una vez que los 4 agentes terminan:
- Consolidar todos los outputs en `01_DESCUBRIR.md` (un solo archivo por cliente)
- Completar el Quality Gate de Fase 1 antes de proceder a Fase 2

**Quality Gate — Fase 1 (común a B2C y B2B):**
- [ ] ¿Todas las afirmaciones tienen fuente o están marcadas como `[inferencia]`?
- [ ] ¿Los datos de mercado son recientes (< 2 años)?
- [ ] ¿Se analizaron mínimo 3 competidores locales + 1 referente nacional/internacional?
- [ ] ¿El contexto de mercado tiene al menos 3 datos con fuente y fecha?

**Solo B2C** — el comprador es una persona y hay conversación pública que escuchar:
- [ ] ¿Se consultaron mínimo 20 reseñas reales de Google del cliente?
- [ ] ¿Se revisó Meta Ads Library del cliente y sus competidores principales?
- [ ] ¿Las objeciones vienen de citas textuales reales, no de inferencia?

**Solo B2B** — el comprador es una empresa o institución:
- [ ] ¿Se documentó el **criterio de compra con evidencia formal** (bases de licitación, criterios
      de precalificación, términos de referencia del trámite)?
- [ ] ¿Se identificó el **costo del fracaso** para el comprador, con al menos un caso real citado?
- [ ] ¿Se identificaron las **barreras de entrada y fosos** del sector (certificaciones, registros,
      firmas autorizadas), distinguiendo las formales de las inferidas?
- [ ] ¿Están listadas las **preguntas para el cliente** que cubren lo que no existe en fuentes
      públicas?

> **No exijas reseñas de Google en B2B.** Nadie postea a qué despacho de ingeniería contrató. Un
> carril que devuelve 0 reseñas en un mercado B2B hizo bien su trabajo si lo declaró como hueco en
> vez de inventar citas. La evidencia equivalente es documental, y la produce `ah-demand-intel`.
> Marcar el criterio como **no aplicable**, no como reprobado.

---

## FASE 2 — DEFINIR

**Objetivo:** Sintetizar los hallazgos de Fase 1 en diagnóstico estructurado + Rúbrica Blue Ocean.

> Leer primero: `00_BRIEF.md` y `01_DESCUBRIR.md`

### 2.1 Resumen ejecutivo del diagnóstico

Sintetizar los hallazgos más críticos de Fase 1 en máximo 5 bullets. No repetir todo — solo lo que mueve la aguja. Formato:
```
HALLAZGO #1: [título]
Evidencia: [qué encontramos que lo demuestra]
Implicación estratégica: [qué significa para el negocio]
```

### 2.2 Buyer Personas con ingreso real

Definir 2-3 perfiles concretos. **No usar solo "NSE A/B" — especificar ingreso familiar en MXN, ocupación concreta, y que las objeciones vengan de evidencia real (reseñas y social listening de Fase 1).**

Para cada perfil:
- **Nombre del perfil** (ej: "El Directivo Local", "El Nearshoring Executive")
- Ingreso familiar estimado en MXN/mes
- Ocupación específica (no genérica)
- Edad aproximada y situación de vida
- Motivación principal de compra (priorizada, no lista genérica)
- Objeciones reales — extraídas de reseñas y social listening
- Comportamiento digital: plataformas que usa, cómo investiga antes de comprar
- Qué necesita escuchar para decidir

### 2.3 Posicionamiento actual vs. deseado

| | Actual | Deseado |
|-|--------|---------|
| Cómo se percibe | | |
| A quién le habla | | |
| Qué promete | | |
| Cómo lo dice | | |

### 2.4 Rúbrica Competitiva Blue Ocean ← PIEZA CENTRAL

Esta es la herramienta que convierte el análisis en estrategia defensible. La recomendación final emerge de aquí, no de intuición.

**Instrucciones:**
1. Completar la tabla con puntuaciones 1-5 para el cliente y cada competidor analizado en Fase 1
2. Cada puntuación debe tener evidencia concreta del research (una frase que la justifique)
3. Calcular la media del mercado por criterio (suma de competidores / número de competidores, sin incluir al cliente)
4. Identificar criterios donde TODA la industria está por debajo de la media → esos son los espacios que nadie ocupa
5. Comparar al cliente contra la media → sus criterios por debajo = brechas urgentes

**Escala:**
- **5** — Excepcional: lo hace mejor que cualquiera, evidencia concreta
- **4** — Bueno: por encima de lo esperado
- **3** — Cumple: hace lo mínimo esperado, sin distinguirse
- **2** — Débil: intenta pero con errores o inconsistencias notorias
- **1** — Ausente o roto: no lo hace, o genera fricción activa

**Los 7 Criterios Universales** (ajustables por industria, máximo 9):

| # | Criterio | Descripción del criterio |
|---|---|---|
| 1 | **Calidad Percibida del Producto/Servicio** | Renders, portafolio, casos de éxito, nivel de acabados, congruencia entre promesa y entrega visible |
| 2 | **Precio: Visibilidad y Contextualización de Valor** | ¿Publican precio? Si lo hacen, ¿lo contextualizan con argumentos que justifican el número? Sin contexto, el comprador solo compara número vs. número |
| 3 | **Confianza Institucional** | Años de trayectoria, proyectos entregados, reputación pública, menciones en prensa, reseñas verificables |
| 4 | **Experiencia Digital** | Web funcional, SEO activo, redes actualizadas, sin errores técnicos críticos, blog vivo |
| 5 | **Facilidad del Proceso de Primer Contacto** | CTA visible, WhatsApp activo o formulario claro, evidencia de respuesta rápida |
| 6 | **Claridad y Concreción del Mensaje** | ¿Hablan con datos específicos o con aspiracional vago? "Valor que trasciende" vs. "único club de golf nocturno en la ciudad" |
| 7 | **Propuesta Diferenciada con Argumento Comparativo** | ¿Explican por qué ellos vs. las otras opciones? ¿El comprador puede construir mentalmente la comparación? |

**Tabla de puntuaciones:**

| Criterio | [Cliente] | [Comp 1] | [Comp 2] | [Comp 3] | [Comp 4] | Media mercado | ¿Sector falla aquí? |
|---|---|---|---|---|---|---|---|
| 1. Calidad Producto | | | | | | | |
| 2. Precio + Contexto | | | | | | | |
| 3. Confianza | | | | | | | |
| 4. Experiencia Digital | | | | | | | |
| 5. Primer Contacto | | | | | | | |
| 6. Claridad Mensaje | | | | | | | |
| 7. Argumento Comparativo | | | | | | | |
| **Promedio** | | | | | | | |

**Interpretación:**
- Media del mercado < 3.0 en un criterio = toda la industria falla ahí = espacio que nadie ocupa
- Cliente < media del mercado en un criterio = brecha urgente a resolver
- Cliente > media del mercado = ventaja a mantener y comunicar

**Conclusión Estratégica** (completar después de la tabla):
> "El sector en [industria/ciudad] falla principalmente en [criterio(s) con puntuación más baja].
> Ningún competidor ofrece [descripción concreta del vacío].
> [Cliente] puede ocupar ese espacio porque [evidencia de Fase 1 que lo respalda]."

### 2.5 Mapa de Diferenciación

Con base en la Rúbrica:
- ¿Qué hacen TODOS los competidores igual? (criterios donde todos tienen 3+)
- ¿Qué no hace NADIE en este mercado? (criterios donde toda la industria está por debajo de la media)
- ¿Dónde tiene el cliente ventaja real sobre la media? (criterios donde está por encima)

### 2.6 Problem Statement

> "**[Nombre del cliente]** tiene [fortaleza real — evidencia Fase 1], pero [el gap crítico de la Rúbrica que nadie en el sector resuelve]."

---

**Quality Gate — Fase 2:**
- [ ] ¿Los buyer personas tienen ingreso real en MXN (no solo NSE)?
- [ ] ¿Las objeciones en los perfiles vienen de reseñas o social listening reales?
- [ ] ¿La Rúbrica tiene al menos 3 competidores con puntuaciones justificadas por evidencia?
- [ ] ¿Se calculó la media del mercado por criterio?
- [ ] ¿La Conclusión Estratégica cita criterios específicos de la tabla?
- [ ] ¿El Problem Statement está soportado por evidencia de la Rúbrica?

---

## FASE 3 — DESARROLLAR

**Objetivo:** Construir la recomendación estratégica anclada en los datos de la Rúbrica.

> Leer primero: `00_BRIEF.md` y `02_DEFINIR.md`
>
> La estrategia emerge de los datos de la Rúbrica, no al revés. No partir de intuición y confirmar con datos — partir de los datos y ver qué emerge.

### 3.1 Recomendación Estratégica Central

Una declaración clara, en comillas, que resume el posicionamiento recomendado. Debe citar directamente los criterios de la Rúbrica donde el sector falla.

Formato:
> **"[Cliente] debe ser el primero en [industria/ciudad] en [criterio(s) con puntuación baja en toda la industria], posicionándose como [beneficio concreto] para [buyer persona principal]."**

Esta declaración es la que va en el pitch, en la Estrategia Light, y orienta todas las acciones tácticas.

### 3.2 Recomendaciones Transversales (3-4)

Recomendaciones de alto nivel respaldadas por evidencia de la Rúbrica o el research. Formato por recomendación:

```
RECOMENDACIÓN: [Una oración]
Por qué: [Evidencia del research — cita el hallazgo específico]
Cómo desde Alto House: [Qué acción concreta toma Alto House para ejecutar esto]
```

### 3.3 Acciones Tácticas por Buyer Persona

Para cada perfil definido en Fase 2, acciones específicas diferenciadas:

```
PERFIL: [Nombre del perfil]
Mensaje clave: [Una frase que resuena con sus motivaciones y objeciones reales]
Canal principal: [Dónde está este perfil digitalmente]
Acción concreta: [Qué hacer primero]
```

No mensajes genéricos para todos los perfiles. Si no hay diferencia entre perfiles, los perfiles están mal definidos.

### 3.4 Pipeline Digital

Flujo completo del lead desde el primer punto de contacto hasta el cierre:

```
[Canal/Fuente] → [Landing o punto de captura] → [Primer contacto: WhatsApp/CRM/Formulario] → [Asesor/Vendedor] → [Cierre]
```

Para clientes con canales tradicionales (espectaculares, eventos, puntos de venta físicos):
- ¿Cómo se conectan al mismo pipeline digital? (QR codes, landing pages con UTM, registro en evento)

### 3.5 Roadmap 90 días

| Mes | Foco | Acciones (3-4) |
|-----|------|----------------|
| **Mes 1 — Fundamentos** | Construir la base | - Configurar HubSpot/CRM con pipeline real<br>- Corregir errores técnicos críticos de la web (meta descriptions, velocidad, CTAs)<br>- Activar pixel de Meta y GA4 correctamente |
| **Mes 2 — Contenido y Activación** | Empezar a comunicar el diferenciador | - Publicar contenido de storytelling anclado en la Recomendación Central<br>- Activar Google Reviews de clientes actuales<br>- Lanzar campañas de paid media con mensajes concretos (no aspiracionales) |
| **Mes 3 — Aceleración** | Medir y optimizar | - Revisar pipeline: ¿dónde se caen los leads?<br>- Optimizar campañas con datos reales<br>- Primeros reportes de KPIs con baseline vs. actual |

Personalizar para el cliente específico. No copiar este template literalmente.

### 3.6 Evaluación con /council

Usar el skill `council` para evaluar la Recomendación Central y las Transversales con perspectivas múltiples:

```
/council para evaluar la estrategia de [cliente]:

Recomendación Central: "[texto]"
Recomendaciones Transversales: [lista]
Buyer personas: [resumen]
Evidencia de Rúbrica: [criterios clave]

Preguntas:
1. ¿La Recomendación Central está anclada en los datos de la Rúbrica o es una opinión disfrazada de dato?
2. ¿Hay un espacio estratégico que la Rúbrica revela pero la estrategia no está explotando?
3. ¿Qué riesgos tiene ejecutar esta recomendación que no son evidentes?
4. ¿Las acciones tácticas son diferenciadas por persona o son genéricas para todos?
```

### 3.7 Síntesis con strategic-compact

Usar `strategic-compact` para comprimir la estrategia completa en síntesis ejecutiva de una página:

```
/strategic-compact [cliente] [estrategia completa]
```

---

**Quality Gate — Fase 3:**
- [ ] ¿La Recomendación Central cita criterios específicos de la Rúbrica (no es opinión)?
- [ ] ¿Las acciones tácticas están diferenciadas por buyer persona?
- [ ] ¿El roadmap 90 días es ejecutable con operaciones ligeras de Alto House?
- [ ] ¿El council evaluó la Recomendación Central, no solo enfoques genéricos?

---

## FASE 4 — ENTREGAR

**Objetivo:** Transformar el research en entregables concretos para el cliente.

> Leer primero: `00_BRIEF.md` y `03_DESARROLLAR.md`

### 4.1 Recomendación de paquete

| Señal del research | Paquete recomendado |
|---|---|
| Negocio nuevo / sin presencia / sin marca | **Colorado** |
| Negocio operando bien, imagen no refleja calidad | **Sonora** |
| Negocio maduro, quiere delegación total | **Patagonia** |
| Alto potencial identificado, Alto House quiere apostar | **Sahara** |

Documentar la recomendación con justificación de research, inversión detallada, y alternativa si el cliente quiere empezar más pequeño.

> **Nota Sahara:** Si el research revela palancas de crecimiento no capitalizadas (común en médicos, clínicas, arquitectos, inmobiliarias), proponer Sahara con justificación explícita de qué palanca se ve y por qué Alto House quiere apostar.

### 4.2 Estrategia Light (entregable gratuito)

```
/estrategia-light [cliente] [hallazgos principales + Recomendación Central]
```

La Estrategia Light es el primer entregable de valor que Alto House regala al prospecto ANTES de que firme. Demuestra que ya hicimos el trabajo. Reduce el riesgo percibido. Acelera la decisión.

### 4.3 Primer contenido de regalo

Junto con la Estrategia Light, preparar el primer contenido real:
- 1 post de redes listo para publicar (el más fuerte según el research)
- 1 propuesta de copy para el hero del website
- O 1 email de bienvenida para su base de contactos

### 4.4 Preparación del pitch

Script de 15-20 minutos:
1. **Apertura (2 min)** — "Investigamos tu negocio antes de esta reunión."
2. **Diagnóstico (5 min)** — Los hallazgos más críticos. Terminar con el Problem Statement.
3. **La Rúbrica (3 min)** — "Aquí está cómo está tu sector. Este es el espacio que nadie ocupa. Aquí está tu posición hoy."
4. **La Estrategia (4 min)** — Recomendación Central + 3 acciones concretas de los primeros 30 días.
5. **El regalo (2 min)** — Entregar Estrategia Light + primer contenido. "Esto es lo que haríamos si ya fuéramos tu agencia."
6. **La propuesta (3 min)** — Paquete recomendado + inversión + "¿Cuándo quieres empezar?"

### 4.5 KPIs con baseline y target

| KPI | Cómo medirlo | Baseline actual | Target 90 días |
|-----|-------------|----------------|----------------|
| Leads digitales generados/mes | Meta Ads Manager + GA4 | [dato actual o estimado] | |
| Costo por lead calificado | Meta Ads Manager | [dato actual o estimado] | |
| Tasa de conversión lead → cita/demo | CRM / HubSpot | [dato actual o estimado] | |
| Visitas web mensuales | GA4 | [dato actual] | |
| Posición orgánica keywords prioritarias | Google Search Console | [posición actual] | |
| Engagement rate redes | Meta Business Suite | [dato actual] | |
| Reseñas Google (cantidad + calificación) | Google Business | [dato actual] | |
| Tiempo de respuesta al primer contacto | CRM / WhatsApp Business | [dato actual o estimado] | |

Completar con KPIs específicos del sector. Target a 90 días = ambicioso pero alcanzable con las acciones del Roadmap.

> Los KPIs deben estar ligados a ventas, no solo a métricas de marketing. Si no hay dato de baseline, usar estimado del research de Fase 1 marcado con `~`.

### 4.6 Condiciones Críticas para el Éxito

3-5 condiciones que, si no se cumplen, la estrategia no funciona. Honestidad total — estas son dependencias del cliente, no del equipo de Alto House.

Formato:
```
CONDICIÓN CRÍTICA #1: [enunciado]
Por qué importa: [consecuencia concreta si no se cumple]
```

Ejemplos de condiciones típicas:
- "El equipo de ventas debe responder leads en menos de 5 minutos durante las primeras semanas"
- "El cliente debe proporcionar acceso a Meta Business y Google Ads antes del Mes 1"
- "Se requiere presupuesto mínimo de $X en paid media durante los primeros 90 días"

### 4.7 Referencias Numeradas

Listar todas las fuentes consultadas durante el research, con URL y fecha de acceso. Esto convierte el entregable en un reporte citable, no solo una presentación.

Formato:
```
[1] Nombre de la fuente — URL — Fecha de acceso
[2] Nombre de la fuente — URL — Fecha de acceso
```

### 4.8 Entregables en Figma Slides

```
/figma-use-slides

Crear presentación de estrategia para [cliente] con:
- Estética Alto House: Kaftan (display), Satoshi (body)
- Colores: #ECE5DA (crema), #35544E (verde), #9E3A26 (terracota), #3D3D3D (carbón)
- Estructura: Cover → Diagnóstico → 5 hallazgos → Rúbrica Blue Ocean → Diferenciador →
  Recomendación Central → Acciones por persona → Roadmap → Propuesta → Inversión
```

---

**Quality Gate — Fase 4:**
- [ ] ¿Los KPIs incluyen baseline actual (o estimado con `~`) y target a 90 días?
- [ ] ¿Las Condiciones Críticas son dependencias reales del cliente, no del equipo?
- [ ] ¿Todas las fuentes del research están listadas con URL y fecha de acceso?
- [ ] ¿La Estrategia Light usa la Recomendación Central de Fase 3 como núcleo?

---

## Outputs del Workflow

Al completar las 4 fases:

1. **`01_DESCUBRIR.md`** — Research completo con 4 secciones paralelas consolidadas
2. **`02_DEFINIR.md`** — Buyer personas + Rúbrica Blue Ocean + Conclusión Estratégica + Problem Statement
3. **`03_DESARROLLAR.md`** — Recomendación Central + Transversales + Acciones por Persona + Roadmap 90 días
4. **`04_ENTREGAR.md`** — KPIs con baseline/target + Condiciones Críticas + Referencias Numeradas
5. **Estrategia Light** — PDF/Figma para entregar al cliente gratuitamente
6. **Primer contenido de regalo** — Contenido listo para publicar
7. **Presentación de propuesta** — Figma Slides con estética Alto House
8. **Recomendación de paquete** — Con justificación de research
9. **Speech de pitch** — Script preparado para la reunión

---

## Cómo usar este skill

```
/alto-house/research-workflow [nombre del cliente] [industria]

Ejemplo:
/alto-house/research-workflow "Casa Nogal" "cocinas y baños de lujo"
/alto-house/research-workflow "Dr. García" "medicina estética CDMX"
/alto-house/research-workflow "Arq. Morales" "arquitectura residencial Monterrey"
```

---

## Integración con otros skills y agentes

**Fase 1 — Paralelo:**
- `seo-specialist` (agente) — Audit digital
- `marketing-agent` (agente) — Presencia y contenido del cliente
- `market-research` — Análisis competitivo
- `deep-research` — Síntesis con citaciones
- `keyword-researcher` (agente) — Saturación de mercado
- `social-listening` (skill propio) — Voz real de la audiencia
- `research-ops` — Orquestador de investigación

**Fase 2:**
- `alto-house/market-differentiation` — Complementa la Rúbrica con el mapa de diferenciación

**Fase 3:**
- `council` — Evaluación multi-perspectiva de la Recomendación Central
- `strategic-compact` — Síntesis ejecutiva de una página
- `brand-voice` — Definir tono de comunicación del cliente

**Fase 4:**
- `alto-house/estrategia-light` — Entregable gratuito pre-cierre
- `figma:figma-use-slides` — Presentación final en Figma
- `content-engine` — Primer contenido de regalo
