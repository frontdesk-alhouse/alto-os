# Codex en el Alto House OS — playbook

> Cómo se usa Codex CLI junto a Claude Code en el trabajo de Alto House.
> Probado en: validación de hojas de Cliente D · red-team del wedge de Cliente A (2026-07-30).

---

## El principio

**Claude decide. Codex verifica y carga el volumen.**

Codex corre contra cuota de ChatGPT, no contra créditos de Claude. Todo lo que sea mecánico,
verificable o adversarial se delega. Lo que requiere criterio, síntesis o voz de marca, no.

| Claude | Codex |
|---|---|
| Criterio y síntesis | Volumen y reducción |
| Estrategia y recomendación | Verificación contra fuente |
| Copy y voz de marca | Auditoría adversarial |
| Diseño y decisión visual | Scoring con rúbrica |

---

## Setup

```bash
codex --version          # 0.144.5 al momento de escribir
```

**Gotcha:** con cuenta de ChatGPT (no API key) **no** se puede pasar `-m gpt-5.1-codex-max` — truena
con `invalid_request_error`. Usar el modelo por defecto y subir el esfuerzo:

```bash
codex exec --skip-git-repo-check -c model_reasoning_effort=high "$(cat prompt.md)"
```

**Gotcha 2:** `timeout` no existe en macOS por defecto. No envolver el comando; usar el timeout del
tool de Bash.

**Gotcha 3:** el prompt va como argumento, no por stdin. Escribirlo a un archivo y pasarlo con
`"$(cat archivo.md)"` — evita problemas de escapado con prompts largos.

---

## Los cuatro usos probados

### 1 · Reducción de volumen — optimizar créditos

El costo real de un research no es razonar: es **leer**. Un crawl de 10 sitios o 2,000 reseñas de G2
son cientos de miles de tokens que no deben pasar por Claude.

```bash
codex exec --skip-git-repo-check \
  "Lee $DUMP. Extrae por cada sitio: categoría que reclama, hero, pricing visible,
   postura sobre autonomía vs control humano. Devuelve JSON con ese esquema exacto. Nada más."
```

Claude solo lee el JSON. Ahorro observado: 70-80% de los tokens de fase de descubrimiento.

### 2 · Fact-check contra fuente

Cada afirmación marcada `[HECHO]` se entrega con su fuente. Codex devuelve
`PASS` / `FAIL` / `UNVERIFIABLE` más la cita textual. Lo que no pase se degrada a `[inferencia]` o
se borra.

Crítico cuando el cliente aporta cifras propias que van a ir a un sitio público — números sin
verificar son un pasivo legal y reputacional.

### 3 · Red-team adversarial ⭐ el de mayor valor

Se le entrega la recomendación y se le instruye **destruirla**, construyendo el caso más fuerte para
la opción perdedora. Instrucción clave en el prompt:

> *"Give a verdict: does the recommendation SURVIVE or FAIL? **Default to FAIL if the reasoning is
> weak.**"*

Sin ese default, el modelo tiende a validar.

**Caso Cliente A:** la síntesis *"reclamar la categoría, venderla por la gobernanza"* era elegante y
coherente con los datos. Codex la tumbó con un ataque correcto: toda la evidencia venía de la fase en
que el comprador **aprueba**, ninguna de la fase en que **empieza a buscar**. Sin ese pase, habría
llegado al cliente como conclusión firme.

**Regla que queda:** ningún veredicto estratégico se presenta a cliente sin haber sobrevivido un
intento serio de destruirlo.

### 4 · Scoring con rúbrica

Reglas explícitas como criterio, Codex puntúa /10 por documento. Se aplica a quality gates de fase y
al checklist SEO antes de publicar. No se gasta razonamiento de Claude en revisar checklists
mecánicos.

---

## Cómo leer un FAIL

Un FAIL **no** significa tirar el trabajo. Significa:

1. Adjudicar ataque por ataque — cuáles se aceptan y cuáles se rechazan, con razón escrita.
2. Degradar el nivel de confianza de lo que no se sostiene (de "recomendación" a "hipótesis").
3. Conservar lo que sí resiste, con su alcance corregido.
4. Nombrar la evidencia que cerraría la pregunta y quién puede conseguirla.

Codex también se equivoca: en el caso Cliente A atacó una versión más débil de la propuesta de la que
estaba escrita. Adjudicar es trabajo de Claude, no de Codex.

---

## Cuándo NO usar Codex

- Copy final o voz de marca — no conoce el sistema de voz del cliente.
- Decisiones visuales.
- Cualquier cosa que requiera contexto acumulado de la relación con el cliente.
- Como segunda opinión "para estar seguros" sin pregunta concreta — devuelve prosa plausible.

---

*Alto House OS*
