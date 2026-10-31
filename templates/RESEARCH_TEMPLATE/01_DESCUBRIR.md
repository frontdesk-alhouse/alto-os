# FASE 1 — DESCUBRIR: [Nombre del Cliente]

> **Research amplio y sin filtros.** El objetivo es recopilar evidencia cruda antes de interpretar.
> Los 4 agentes corren en paralelo — cada uno llena su sección de este archivo.
> No interpretar ni filtrar en esta fase. Solo datos, con fuente.

---

## Instrucciones de Ejecución

**Antes de lanzar los agentes:**
1. Leer `00_BRIEF.md` — datos del cliente, contexto del negocio, ciudad/región, segmento
2. Lanzar los 4 agentes en un solo mensaje (paralelo). No esperar que uno termine para lanzar el siguiente
3. Una vez que los 4 terminan, consolidar sus outputs en las secciones de este archivo
4. Completar el Quality Gate antes de pasar a `02_DEFINIR.md`

```
LANZAR EN PARALELO — Un solo mensaje con 4 bloques:

[Agente A] seo-specialist + marketing-agent
Instrucción: Audit digital completo del cliente [nombre] — web, redes, pipeline visible, anuncios activos.
Ver sección "AGENTE A" para detalle de tareas.

[Agente B] market-research + deep-research
Instrucción: Inteligencia competitiva de [industria] en [ciudad] — competidores, referentes, reseñas, menciones, contexto de mercado.
Ver sección "AGENTE B" para detalle de tareas.

[Agente C] keyword-researcher
Instrucción completa:
  keyword-researcher:
  - Negocio: [cliente]
  - Industria: [industria]
  - Ciudad: [ciudad]
  - Objetivo: mapear saturación y encontrar espacios vacíos
  Clasificar resultados en 4 cuadrantes: Rojo/Verde/Amarillo/Azul.

[Agente D] social-listening + research-ops
Instrucción: /alto-house/social-listening "[industria]" "[ciudad]" full
Ver sección "AGENTE D" para detalle de tareas.
```

---

## SECCIÓN A — Audit Digital del Cliente

*Output del Agente A (seo-specialist + marketing-agent)*

### A.1 Sitio Web

| Elemento | Estado | Notas |
|---|---|---|
| URL | | |
| Core Web Vitals (LCP) | | Meta: < 2.5s |
| Core Web Vitals (INP) | | Meta: < 200ms |
| Core Web Vitals (CLS) | | Meta: < 0.1 |
| Meta title | | ¿existe, bien escrito? |
| Meta description | | ¿existe, bien escrito? |
| Schema markup | | ¿qué tipo? ¿implementado? |
| Sitemap | | ¿existe y funciona? |
| Blog / contenido editorial | | ¿frecuencia de publicación? |
| Keywords orgánicas actuales | | ¿por cuáles aparece hoy? |

### A.2 Pipeline Visible (desde redes hasta el vendedor)

Mapear el flujo completo de un lead:
```
[Punto de entrada] → [Destino] → [CTA] → [Primer contacto] → [Asesor]
```

¿El flujo tiene fricción? ¿Cuántos clics para llegar al WhatsApp/formulario?

**Observaciones:**
[completar]

### A.3 Redes Sociales del Cliente

| Red | Seguidores | Frecuencia posts | Engagement estimado | Notas de calidad |
|---|---|---|---|---|
| Instagram | | | | |
| Facebook | | | | |
| TikTok | | | | |
| LinkedIn | | | | |
| YouTube | | | | |

**Formato de contenido predominante:** [videos / carrusel / foto estática / reels / stories]

**Tono percibido:** [formal / casual / técnico / aspiracional / educativo]

**Lo más efectivo que publica (por engagement):**
[completar]

### A.4 Historial de Anuncios del Cliente

**Meta Ads Library** (buscar por nombre de página o marca):
- ¿Tiene anuncios activos? Sí / No
- Cantidad de anuncios activos: ___
- Mensajes predominantes: ___
- Imágenes / videos: ___
- Período de pauta más reciente: ___
- ¿Hay patrones de mensajes que repiten? ___

**Google Ads Transparency Center:**
- ¿Aparece? Sí / No
- Keywords / mensajes si tiene: ___

### A.5 Observaciones Críticas (Agente A)

Las 3-5 cosas más importantes que el cliente necesita resolver en su presencia digital:
1. [observación]
2. [observación]
3. [observación]

---

## SECCIÓN B — Inteligencia Competitiva

*Output del Agente B (market-research + deep-research)*

### B.1 Competidores Locales

Para cada competidor (mínimo 3, máximo 5):

#### [Competidor 1 — Nombre]
- **URL:** 
- **Propuesta de valor real** (no el copy aspiracional, el beneficio concreto que ofrece):
- **CTA principal en el sitio:**
- **Precio o rango visible:** Sí / No. Si sí: ___
- **Google Reviews:** N reseñas, promedio ___/5
- **Fortaleza digital más visible:**
- **Debilidad más visible:**
- **Anuncios en Meta Ads Library:** Sí / No. Mensajes: ___

#### [Competidor 2 — Nombre]
- **URL:** 
- **Propuesta de valor real:**
- **CTA principal:**
- **Precio visible:** 
- **Google Reviews:** N reseñas, promedio ___/5
- **Fortaleza:**
- **Debilidad:**
- **Anuncios Meta Ads Library:** 

#### [Competidor 3 — Nombre]
- **URL:** 
- **Propuesta de valor real:**
- **CTA principal:**
- **Precio visible:** 
- **Google Reviews:** N reseñas, promedio ___/5
- **Fortaleza:**
- **Debilidad:**
- **Anuncios Meta Ads Library:** 

### B.2 Referentes Nacionales / Internacionales

2-3 empresas del mismo segmento que hacen algo notable en marketing, experiencia de cliente, o contenido digital. Foco: **¿qué se puede adaptar al mercado local de [ciudad]?**

#### [Referente 1 — Nombre y mercado]
- Lo que hace diferente:
- Qué adaptaría Alto House para el cliente local:

#### [Referente 2 — Nombre y mercado]
- Lo que hace diferente:
- Qué adaptaría:

### B.3 Reseñas Google — Voz Real de los Clientes

Analizar mínimo 20-30 reseñas de Google del cliente + sus 2 competidores principales.

**Del cliente [nombre]:** ___ reseñas totales, promedio ___/5
- Frases más repetidas en reseñas positivas (citar literalmente):
  - "___"
  - "___"
  - "___"
- Frases más repetidas en reseñas negativas / objeciones:
  - "___"
  - "___"

**Del competidor 1:**  ___ reseñas, ___/5
- Lo que más valoran: "___"
- Objeción más común: "___"

**Del competidor 2:**  ___ reseñas, ___/5
- Lo que más valoran: "___"
- Objeción más común: "___"

> Las frases literales de reseñas son oro. Son las palabras exactas que el buyer persona usa para describir el valor (y el problema).

### B.4 Menciones y Reputación Pública

- ¿Aparece el cliente en medios locales o nacionales? ¿En qué contexto?
- ¿Hay controversias, quejas públicas, o notas negativas?
- ¿Premios, reconocimientos, o credenciales verificables?

[completar]

### B.5 Contexto de Mercado con Datos Duros

**Cada dato debe tener fuente y fecha.** No afirmaciones sin sustento.

| Dato | Fuente | Fecha |
|---|---|---|
| [tendencia del sector] | [INEGI / BBVA Research / IMCO / etc.] | [mes/año] |
| [indicador económico de la ciudad] | | |
| [crecimiento del segmento] | | |
| [dato de demanda] | | |

**Implicación estratégica del contexto:** [qué significa para el cliente específico]

---

## SECCIÓN C — Keywords y Saturación de Mercado

*Output del Agente C (keyword-researcher)*

### C.1 Tabla de Keywords por Volumen e Intención

| Keyword | Volumen/mes | Intención | Competencia | Cuadrante |
|---|---|---|---|---|
| | | info/transac/comercial | alta/media/baja | Rojo/Verde/Amarillo/Azul |

*(El agente llena esta tabla con mínimo 20-30 keywords)*

### C.2 Mapa de 4 Cuadrantes

| Cuadrante | Keywords | Estrategia |
|---|---|---|
| **Rojo — Saturado** (alto volumen, alta competencia) | | Entrar con ángulo distinto |
| **Verde — Oportunidad** (alto volumen, baja competencia) | | **Atacar primero** |
| **Amarillo — Trampa** (bajo volumen, alta competencia) | | Evitar |
| **Azul — Nicho** (bajo volumen, baja competencia) | | Evaluar viabilidad |

### C.3 Keywords Prioritarias (Top 10)

Ordenadas por oportunidad real:
1. [keyword] — [volumen] búsquedas, intención [X], competencia [Y]
2. [keyword] — 
3. [keyword] — 
...

### C.4 Tendencias 30 días

- ¿Qué categoría está creciendo?
- ¿Qué keyword emergente aún nadie domina?

### C.5 Calendario de Contenido Inicial (30 días)

| Semana | Tema | Keyword objetivo | Formato |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

---

## SECCIÓN D — Social Listening

*Output del Agente D (social-listening + research-ops)*

### D.1 Conversaciones Reales

¿Qué dice la gente en Reddit, foros, comunidades sobre este tipo de negocio/servicio en México?

**Plataformas consultadas:**
- [ ] Reddit (subreddits relevantes)
- [ ] Google Reviews (ya en Sección B)
- [ ] Foros especializados
- [ ] Facebook Groups públicos
- [ ] Twitter/X (si aplica)

**Temas más frecuentes de conversación:**
[completar]

### D.2 Objeciones No Filtradas

Las que nadie menciona en una junta formal, pero sí se leen en internet:
- Objeción #1: "___"
- Objeción #2: "___"
- Objeción #3: "___"

> Estas son las que hay que responder en el contenido y en el pitch de ventas.

### D.3 Lenguaje Real del Comprador

Frases literales que usa la audiencia para describir el problema o la solución (copiar textual):
- "___"
- "___"
- "___"

Estas frases son la materia prima del copy. Usar el lenguaje del cliente, no el de la industria.

### D.4 Marcas Mencionadas y Por Qué

¿Qué competidores nombra la gente? ¿En qué contexto (positivo/negativo)?
[completar]

### D.5 Temas Emergentes Sin Competidor Posicionado

¿Hay algún tema que la gente busca / pregunta pero que ningún competidor responde bien aún?
[completar]

---

## Quality Gate — Fase 1

Completar antes de pasar a `02_DEFINIR.md`:

- [ ] ¿Todas las afirmaciones tienen fuente o están marcadas como `[inferencia]`?
- [ ] ¿Los datos de mercado en B.5 son recientes (< 2 años) y tienen fuente específica?
- [ ] ¿Se revisó Meta Ads Library del cliente y sus competidores principales?
- [ ] ¿Se analizaron mínimo 20 reseñas reales de Google del cliente?
- [ ] ¿Se analizaron mínimo 3 competidores locales con propuesta de valor concreta?
- [ ] ¿Hay al menos 1 referente nacional/internacional con observaciones adaptables?
- [ ] ¿El contexto de mercado tiene al menos 3 datos con fuente y fecha?
- [ ] ¿Las objeciones en D.2 vienen de fuentes reales (no son inferidas)?
- [ ] ¿Las keywords de la Sección C están clasificadas por cuadrante?

**Notas adicionales del research:**
[Aquí va cualquier hallazgo que no encajó en las secciones anteriores pero es relevante]

---

*Próximo archivo: `02_DEFINIR.md`*
