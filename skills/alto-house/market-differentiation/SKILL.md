---
description: "Análisis de saturación de mercado y Rúbrica Blue Ocean para responder '¿cómo me voy a diferenciar?' — con evidencia cuantificada de keyword research, análisis competitivo y los 7 criterios de valor del sector"
argument-hint: "[cliente] [industria] [ciudad/región]"
---

# Alto House — Market Differentiation Analysis

> Responde la pregunta más frecuente de los prospectos: **"¿Cómo me voy a diferenciar yo?"**
> Produce un mapa de diferenciación con evidencia cuantificada: Rúbrica Blue Ocean + keywords + competidores.

**Input**: $ARGUMENTS (cliente, industria, ciudad/región)

---

## El problema que resuelve

Los clientes siempre preguntan lo mismo:
- "¿Cómo me diferencio de la competencia?"
- "Ya hay muchos en mi industria, ¿para qué sirve tener presencia digital?"
- "Mis competidores ya llevan mucho tiempo en esto"

Este skill responde esas preguntas con datos cuantificados, no con opiniones.

La lógica central:
> Si el mercado falla en claridad de precios, el diferenciador es ser el primero en publicarlos con contexto.
> Si todos hablan de su empresa, el diferenciador es hablar del cliente y sus resultados.
> Si todos usan las mismas keywords, hay keywords de igual intención que nadie usa.
> La estrategia no se diseña — **emerge de donde la industria falla**.

---

## PASO 1 — Mapeo de keywords del mercado

Usar el agente `keyword-researcher`:

```
keyword-researcher:
- Negocio: [cliente]
- Industria: [industria]
- Ubicación: [ciudad/región]
- Objetivo: mapear saturación y encontrar espacios vacíos
```

### Clasificar los resultados en 4 zonas:

| Zona | Característica | Estrategia |
|---|---|---|
| **Rojo** — Saturado | Alto volumen + alta competencia | Entrar con ángulo diferente, no frontal |
| **Verde** — Oportunidad | Alto volumen + baja competencia | Prioridad máxima, atacar rápido |
| **Amarillo** — Trampa | Bajo volumen + alta competencia | Evitar, no vale la inversión |
| **Azul** — Nicho | Bajo volumen + baja competencia | Evaluar si el volumen es suficiente |

---

## PASO 2 — Análisis de comunicación competitiva

Para cada competidor principal (3-5 competidores):

### 2.1 ¿Qué dice su sitio web?
- Headline principal y propuesta de valor explícita
- CTA principal: ¿qué pide al visitante que haga?
- ¿Publican precios? ¿Con qué contexto?
- ¿Hablan con datos específicos o con aspiracional vago?

### 2.2 ¿Qué dice en redes sociales?
- Tipo de contenido predominante (valor, promociones, testimonios, proceso, detrás de cámaras)
- Tono de voz (formal, casual, técnico, emocional)
- Frecuencia de publicación

### 2.3 ¿Qué dicen sus reseñas?
- Reseñas positivas: ¿qué valoran los clientes? (frases literales)
- Reseñas negativas: ¿qué los defrauda? (objeciones reales)
- Palabras que repiten los clientes satisfechos

### 2.4 Historial de anuncios
- Meta Ads Library: ¿qué mensajes están probando? ¿qué imágenes?
- Google Ads Transparency: ¿qué keywords pagan? ¿qué copy usan?

### 2.5 Tabla resumen de competidores

| Competidor | Propuesta de valor real | Tono | Precio visible + contexto | Fortaleza | Debilidad |
|---|---|---|---|---|---|
| [Comp 1] | ... | ... | ... | ... | ... |
| [Comp 2] | ... | ... | ... | ... | ... |
| [Comp 3] | ... | ... | ... | ... | ... |

---

## PASO 3 — Rúbrica de Valor Blue Ocean

Esta es la pieza que transforma el análisis en estrategia defendible. Calificar a cada competidor en los 7 criterios de valor del sector para identificar dónde falla toda la industria.

**Escala:**
- **5** — Excepcional: evidencia concreta de que lo hace mejor que todos
- **4** — Bueno: por encima del estándar del sector
- **3** — Cumple: hace lo mínimo esperado
- **2** — Débil: intenta pero con errores o inconsistencias notorias
- **1** — Ausente o roto: no lo hace, o genera fricción activa

**Los 7 Criterios Universales** (ajustables por industria, máximo 9):

| # | Criterio | Qué evalúa |
|---|---|---|
| 1 | **Calidad Percibida del Producto/Servicio** | Portafolio visible, casos de éxito, congruencia entre promesa y entrega demostrable |
| 2 | **Precio: Visibilidad y Contextualización de Valor** | ¿Publican precio? ¿Lo justifican con argumentos vs. alternativas? Sin contexto, el comprador compara solo número vs. número |
| 3 | **Confianza Institucional** | Años de trayectoria, proyectos entregados, reputación pública, reseñas verificables |
| 4 | **Experiencia Digital** | Web funcional, SEO activo, redes actualizadas, sin errores críticos |
| 5 | **Facilidad del Proceso de Primer Contacto** | CTA visible y claro, WhatsApp activo o formulario simple, evidencia de respuesta rápida |
| 6 | **Claridad y Concreción del Mensaje** | Datos específicos vs. aspiracional vago. "Único campo de golf nocturno en la ciudad" vs. "valor que trasciende" |
| 7 | **Propuesta Diferenciada con Argumento Comparativo** | ¿Explican por qué ellos vs. las otras opciones? ¿El comprador puede hacer la comparación mentalmente? |

**Tabla de puntuaciones:**

| Criterio | [Cliente] | [Comp 1] | [Comp 2] | [Comp 3] | Media mercado | ¿Sector falla? |
|---|---|---|---|---|---|---|
| 1. Calidad Producto | | | | | | |
| 2. Precio + Contexto | | | | | | |
| 3. Confianza | | | | | | |
| 4. Experiencia Digital | | | | | | |
| 5. Primer Contacto | | | | | | |
| 6. Claridad Mensaje | | | | | | |
| 7. Argumento Comparativo | | | | | | |
| **Promedio** | | | | | | |

> **Media del mercado** = suma de puntuaciones de competidores ÷ número de competidores (sin incluir al cliente).
>
> Criterios donde la media del mercado < 3.0 = toda la industria falla ahí = espacios vacíos.
>
> Criterios donde el cliente está por debajo de la media = brechas urgentes.

---

## PASO 4 — Identificar los patrones de mercado

Después de la Rúbrica, identificar:

### 4.1 Lo que TODOS hacen igual
- ¿En qué criterios se parecen todos? (puntuaciones similares alrededor de la media)
- ¿Qué mensajes se repiten en todos sus sitios?
- ¿Qué nivel tienen todos en Claridad de Mensaje?

### 4.2 Lo que NADIE está haciendo
- ¿Qué criterios están por debajo de 3.0 en toda la industria? (de la Rúbrica)
- ¿Qué ángulo de comunicación no usa ningún competidor?
- ¿Qué audiencia específica ignora todo el mundo?
- ¿Qué pregunta del cliente nadie responde bien online?

### 4.3 Lo que el CLIENTE puede hacer mejor que nadie
Con base en el brief y la Rúbrica:
- ¿En qué criterios tiene el cliente puntuación superior a la media?
- ¿Qué resultado produce que otros no?
- ¿Qué conocimiento o credencial lo distingue?

---

## PASO 5 — Mapa de Diferenciación

Construir el mapa en tres capas:

### Capa 1: Posicionamiento disponible
El espacio en el mercado que nadie ocupa hoy — derivado directamente de los criterios con puntuación baja en la Rúbrica:
```
"En [industria] en [ciudad], todo el mundo falla en [criterio(s) de Rúbrica con baja puntuación].
Nadie está [describir lo que nadie hace de forma concreta].
[Cliente] puede ser el primero en hacerlo porque [razón concreta de Fase 1]."
```

### Capa 2: Diferenciador central
```
"[Cliente] es [categoría] para [audiencia específica] que quiere [beneficio].
A diferencia de [competidores], [cliente] [diferenciador real con argumento comparativo]."
```

### Capa 3: Prueba de la diferenciación
Evidencia concreta que respalda el diferenciador:
- Dato de la Rúbrica (puntuación específica que lo demuestra)
- Reseña de cliente que lo valida (cita literal)
- Resultado tangible que ya produce el negocio
- Credencial o atributo único verificable

---

## PASO 6 — Recomendaciones de implementación

### 6.1 Keywords prioritarias
Top 10 keywords a atacar primero:
- 3 de alta intención transaccional (quieren comprar ahora)
- 3 de alta intención informacional (están investigando, educarlos)
- 2 keywords del diferenciador (las que nadie usa pero definen el espacio vacío de la Rúbrica)
- 2 keywords de marca personal o reputación

### 6.2 Mensajes por canal
Mensajes derivados del diferenciador identificado:
- **Website hero:** [propuesta de valor concreta, sin aspiracional vago]
- **Instagram bio:** [versión condensada — máximo 150 caracteres]
- **Google Business:** [título y descripción con keywords prioritarias]
- **Contenido:** [3 pilares de contenido que reflejan el diferenciador]

### 6.3 Quick wins en 30 días
3 acciones concretas basadas en los criterios más débiles del sector (de la Rúbrica):

1. **[Acción específica]** — Ataca criterio [N] donde el sector falla. Impacto estimado: [X]
2. **[Acción específica]** — Ataca criterio [N] donde el sector falla. Impacto estimado: [X]
3. **[Acción específica]** — Ataca criterio [N] donde el sector falla. Impacto estimado: [X]

---

## Output final

El análisis produce una síntesis con:

```
MAPA DE DIFERENCIACIÓN — [CLIENTE]

RÚBRICA: La industria falla principalmente en [criterio(s) con puntuación < 3.0]
ESPACIO VACÍO: [Descripción concreta de lo que nadie hace]
POSICIÓN ACTUAL DEL CLIENTE: [Criterios donde está por encima / por debajo de la media]

DIFERENCIADOR DE [CLIENTE]:
"[Capa 2: la frase de posicionamiento]"

TOP 3 KEYWORDS CON OPORTUNIDAD:
1. "[keyword]" — [volumen mensual] búsquedas, baja competencia
2. "[keyword]" — [volumen mensual] búsquedas, baja competencia
3. "[keyword]" — [volumen mensual] búsquedas, baja competencia

PRIMER MOVIMIENTO RECOMENDADO: [acción específica que ataca el criterio más débil del sector]
```

Esta síntesis es el corazón de la presentación de pitch y la Estrategia Light.

---

## Cómo usar este skill

```
/alto-house/market-differentiation [cliente] [industria] [ciudad]

Ejemplo:
/alto-house/market-differentiation "Casa Nogal" "cocinas y baños de lujo" "CDMX"
/alto-house/market-differentiation "Dr. García" "medicina estética" "Guadalajara"
/alto-house/market-differentiation "Plusvalterra" "desarrolladora inmobiliaria premium" "Aguascalientes"
```

---

## Integración en el workflow completo

- **Fase 1 del research-workflow** — Sección 1.6: Mapa de saturación (outputs del Paso 1 de este skill)
- **Fase 2 del research-workflow** — Sección 2.4: Rúbrica Blue Ocean (Paso 3 de este skill)
- **Estrategia Light** — Usar el diferenciador central (Capa 2) como la slide más importante
- **Pitch** — La Rúbrica como slide de análisis de mercado: "Aquí está dónde falla toda la industria"
