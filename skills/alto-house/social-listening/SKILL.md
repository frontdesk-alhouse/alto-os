---
name: ah-social-listening
description: "Social listening para Alto House — analiza conversaciones reales en Reddit, foros, redes y reseñas sobre un tema, marca o industria. Produce insights de sentimiento, tendencias, controversias, rankings y temas emergentes usando Exa. Sin APIs de pago adicionales."
argument-hint: "[tema o industria] [ciudad/mercado opcional] [modo: rank|sentiment|trend|controversy|discovery|full]"
---

# Alto House — Social Listening

> Escucha activa de conversaciones públicas reales sobre un mercado, marca o industria.
> Usa Exa (ya configurado) para obtener señales vivas de Reddit, foros, Google Reviews, redes sociales y comunidades nicho.
> Sin costos de API adicionales — solo tokens de Claude.

**Input:** `$ARGUMENTS` — tema, industria o marca + mercado opcional + modo de análisis

---

## Cuándo activar este skill

- Fase 1.5 del `research-workflow` (comportamiento de audiencia)
- Antes de definir el diferenciador de un cliente
- Cuando el cliente pregunta "¿qué dice la gente de mi competencia?"
- Cuando necesitas validar si un mensaje resuena en la audiencia real
- Cuando quieres descubrir objeciones que nadie menciona en entrevistas
- Standalone: `/alto-house/social-listening [tema] [mercado] [modo]`

---

## Modos de análisis

| Modo | Pregunta que responde | Output |
|------|----------------------|--------|
| `sentiment` | ¿Cómo se siente la gente sobre esto? | Distribución de sentimiento + citas reales |
| `rank` | ¿Qué opciones/marcas prefiere la comunidad? | Ranking con evidencia y razones reales |
| `trend` | ¿Hacia dónde está yendo la conversación? | Línea de tiempo de momentum |
| `controversy` | ¿Dónde hay división de opiniones? | Mapa de argumentos opuestos |
| `discovery` | ¿Qué temas emergentes aún no tienen competidores? | Clusters de conversación nicho |
| `full` | Todo lo anterior | Reporte completo (5-7 min) |

Si no se especifica modo, inferirlo del contexto. Si la pregunta es amplia, usar `full`.

---

## PASO 1 — Construcción de queries de escucha

Antes de buscar, construir un set de queries que cubra:

### 1.1 Queries de conversación directa
```
site:reddit.com "[tema]" reviews OR opiniones OR recomendaciones
site:reddit.com "[tema]" mejor OR peor OR problema OR experiencia
"[tema]" foro OR comunidad OR opinión site:reddit.com OR site:quora.com
```

### 1.2 Queries de comparación
```
"[tema] vs" OR "[tema] alternativas" OR "mejor [tema]"
"[competidor A] vs [competidor B]" site:reddit.com
"[tema]" pros contras OR ventajas desventajas
```

### 1.3 Queries de dolor y objeción
```
"[tema]" problema OR queja OR decepcionado OR frustrado
"[tema]" no funciona OR falla OR arrepiento OR error
"[tema]" caro OR vale la pena OR precio
```

### 1.4 Queries de reseñas y comunidades locales (si hay mercado específico)
```
"[tema]" "[ciudad/país]" reseña OR recomendación OR experiencia
site:trustpilot.com OR site:google.com/maps "[tema]" "[mercado]"
"[tema]" "[mercado]" reddit OR facebook grupo OR foro
```

### 1.5 Queries de tendencias emergentes
```
"[tema]" 2025 OR 2026 tendencia OR nuevo OR cambiando
"[tema]" nicho OR alternativa OR poco conocido
"[tema]" comunidad OR subreddit OR grupo activo
```

Ajustar según el idioma predominante del mercado (español/inglés/ambos).

---

## PASO 2 — Ejecución de búsquedas con Exa

Ejecutar las queries construidas usando `web_search_exa`:

```
web_search_exa(
  query: "[query construida]",
  numResults: 8,
  livecrawl: "always"
)
```

**Parámetros recomendados:**
- `numResults: 8` para queries de conversación
- `numResults: 5` para queries de comparación
- `livecrawl: "always"` para obtener datos frescos, no cacheados
- Ejecutar mínimo 4 queries, máximo 8 por modo

**Fuentes prioritarias a incluir en resultados:**
- Reddit (subreddits del nicho)
- Google Reviews / Yelp / Trustpilot
- Quora
- Foros especializados del sector
- Grupos públicos de Facebook (indexados por Exa)
- Twitter/X si Exa lo indexa

**Señales a extraer de cada resultado:**
- Texto de la conversación (quote exacto cuando sea posible)
- Fuente y URL
- Engagement aproximado (upvotes, replies, si está visible)
- Fecha (para análisis de tendencia)
- Autor/comunidad de origen

---

## PASO 3 — Análisis según modo

### MODO: SENTIMENT

**Objetivo:** Medir el pulso emocional de la conversación.

Para cada resultado recolectado, clasificar:
- `Muy positivo` — entusiasmo activo, recomendación fuerte
- `Positivo` — satisfacción general, sin reservas mayores
- `Mixto` — satisfecho en algo, pero con reservas claras
- `Negativo` — decepción, queja, advertencia a otros

**Output del análisis:**
```
DISTRIBUCIÓN DE SENTIMIENTO
Muy positivo: X%  |  Positivo: X%  |  Mixto: X%  |  Negativo: X%

CITAS MÁS REPRESENTATIVAS (máx. 3 por categoría):
[Positivo] "..." — usuario en r/[subreddit], [fecha], [URL]
[Negativo] "..." — usuario en [fuente], [fecha], [URL]

PATRÓN CENTRAL:
La mayoría de la conversación positiva gira en torno a [X].
La mayoría de la fricción viene de [Y].

IMPLICACIÓN PARA ALTO HOUSE:
→ Comunicar [X] reduce fricción. Ignorar [Y] es un riesgo de posicionamiento.
```

---

### MODO: RANK

**Objetivo:** Entender qué opciones/marcas prefiere la audiencia real y por qué.

**Metodología:**
1. Identificar entidades mencionadas (marcas, productos, servicios, nombres propios)
2. Contar frecuencia de mención con contexto positivo/negativo
3. Extraer las razones reales de preferencia (no las que las marcas dicen de sí mismas)
4. Ordenar por combinación de: frecuencia + sentimiento + engagement

**Output:**
```
RANKING DE [TEMA] SEGÚN LA COMUNIDAD

#1 — [Nombre]
Sentimiento predominante: [label]
Por qué la gente lo prefiere: [razón real extraída de conversaciones]
Cita representativa: "..." — [fuente]
Punto débil que mencionan: [si existe]

#2 — [Nombre]
...

INSIGHT CLAVE:
La gente elige [X] no por [lo que la marca dice], sino por [lo que realmente importa].
Gap de posicionamiento: [nadie está comunicando Y, que es lo que más valoran]
```

---

### MODO: TREND

**Objetivo:** Ver si la conversación está creciendo, decayendo o cambiando de forma.

**Metodología:**
1. Notar las fechas de publicación en los resultados
2. Identificar si los posts recientes hablan diferente que los de hace 6-12 meses
3. Detectar si hay temas nuevos que antes no aparecían
4. Buscar hitos que cambiaron la conversación (lanzamiento, escándalo, tendencia viral)

**Output:**
```
LÍNEA DE TIEMPO DE LA CONVERSACIÓN

[Hace 12+ meses] La conversación era sobre: [X]
[Hace 6 meses] Empezó a aparecer: [Y] — posible trigger: [evento/causa]
[Hoy] El tema dominante es: [Z]

MOMENTOS CLAVE:
→ [Evento/fecha]: impacto en la conversación — [qué cambió]

DIRECCIÓN ACTUAL:
La conversación está [creciendo / decayendo / fragmentándose / consolidándose] en torno a [tema].

IMPLICACIÓN:
→ Posicionarse hoy en [Z] es estar ahead of the curve. Esperar 6 meses = llegar tarde.
```

---

### MODO: CONTROVERSY

**Objetivo:** Mapear divisiones de opinión — los debates activos en la comunidad.

**Metodología:**
1. Identificar posts con alta tensión (muchos comentarios, opiniones opuestas)
2. Extraer los dos lados del debate con sus argumentos reales
3. Medir intensidad (cuánta gente está en cada lado, qué tan acalorado está)

**Output:**
```
MAPA DE CONTROVERSIAS

CONTROVERSIA #1: [Título del debate]
Intensidad: [Baja / Media / Alta]

POSICIÓN A — "[argumento central]"
Argumentos: [lista de razones que da este lado]
Cita: "..." — [fuente]

POSICIÓN B — "[argumento contrario]"
Argumentos: [lista de razones]
Cita: "..." — [fuente]

IMPLICACIÓN ESTRATÉGICA:
→ [Nombre del cliente] debe tomar posición en esto, o va a perder credibilidad con ambos lados.
  La posición recomendada es [A/B/neutra] porque [razón basada en el perfil del cliente].
```

---

### MODO: DISCOVERY

**Objetivo:** Encontrar conversaciones emergentes que aún no tienen competidores posicionados.

**Metodología:**
1. Buscar subreddits, foros o comunidades nicho con poca competencia comercial
2. Identificar problemas frecuentes que no tienen solución clara en el mercado
3. Detectar lenguaje específico que usa la audiencia (no el lenguaje de las marcas)
4. Encontrar temas que están creciendo pero aún no son mainstream

**Output:**
```
TEMAS EMERGENTES DE ALTA SEÑAL

TEMA #1: [Nombre del cluster]
Plataformas: [dónde aparece]
Volumen de conversación: [estimado: bajo/medio/alto]
Sentimiento: [positivo/negativo/mixto]
Problema central que expresan: "..."
Lenguaje que usan (vocabulario real): [lista]
Por qué es oportunidad: nadie está [X], pero la gente claramente quiere [Y]

TEMA EMERGENTE MÁS VALIOSO PARA [CLIENTE]:
→ [Tema] porque [razón específica de alineación con el negocio]
→ Primer contenido recomendado: [idea concreta]
```

---

### MODO: FULL

Ejecutar los 5 modos en secuencia. Presentar como reporte unificado con:

1. **Resumen ejecutivo** (5 bullets, máximo)
2. Sentiment completo
3. Rank de actores en el mercado
4. Trend de la conversación
5. Controversias activas
6. Temas emergentes

Cerrar con:
```
TOP 3 INSIGHTS ACCIONABLES PARA [CLIENTE]:
1. [Insight] → Acción concreta recomendada
2. [Insight] → Acción concreta recomendada
3. [Insight] → Acción concreta recomendada
```

---

## PASO 4 — Integración con research-workflow

Cuando este skill se activa desde `research-workflow` (Fase 1.5):

- Los resultados de `sentiment` alimentan la sección de **objeciones y drivers de decisión**
- Los resultados de `rank` complementan el **análisis de competidores** con voz real de usuarios
- Los resultados de `discovery` informan el **mapa de saturación** (qué conversaciones no tiene nadie)
- Los resultados de `controversy` revelan **zonas de posicionamiento de riesgo**

Guardar insights relevantes como `[cliente]_social_listening.md` en el directorio de trabajo si hay contexto de proyecto activo.

---

## Reglas críticas

- **Solo citas reales** — nunca fabricar quotes ni atribuir opiniones a fuentes que no las expresaron
- **Fuentes siempre** — todo insight debe tener URL o fuente verificable de Exa
- **Lenguaje de la audiencia** — reportar en las palabras que usa la gente, no en lenguaje de marketing
- **Sin juicio editorial** — el análisis describe lo que dice la comunidad, no lo que debería decir
- **Contexto de mercado** — si el mercado es México/LATAM, priorizar fuentes en español; si es mixto, reportar ambos idiomas

---

## Ejemplo de invocación

```
/alto-house/social-listening "agencias de marketing digital" "Guadalajara México" sentiment
/alto-house/social-listening "restaurantes italianos" "Monterrey" rank
/alto-house/social-listening "software de contabilidad para pymes" full
/alto-house/social-listening "entrenadores personales" "CDMX" discovery
```
