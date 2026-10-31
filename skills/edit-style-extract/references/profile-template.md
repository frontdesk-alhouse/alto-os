# Plantilla del Perfil de Estilo de Edicion

El perfil es el entregable. Se escribe una vez y se lee muchas veces, en conversaciones donde **no existe el video de referencia ni el analisis** — solo este archivo. Todo lo que no este aqui, se pierde.

## Reglas de escritura

1. **Cada regla debe ser ejecutable sin ver el video original.** "Cortes rapidos" no sirve. "ACL 0.6s, ningun plano pasa de 1.2s" si.
2. **Etiqueta la confianza de cada dato:** `[MEDIDO]` (analyze.py) · `[OBSERVADO]` (frames) · `[INFERIDO]` (juicio).
3. **Numeros en frames Y en segundos.** FCP trabaja en frames; el usuario piensa en segundos.
4. **Solo las dimensiones que el usuario eligio.** Borra las secciones que no aplican en vez de dejarlas vacias — una seccion vacia se lee como "no importa" y no como "no se extrajo".
5. **La seccion NO HACER vale tanto como el resto.** Lo que un estilo evita lo define tanto como lo que hace.
6. **Sin nombres de plugins ni efectos de FCP.** Describe la intencion; el nombre se resuelve en ejecucion.

---

## Plantilla

```markdown
---
perfil: <slug-descriptivo-del-estilo>
version: 1
creado: <YYYY-MM-DD>
fuente: <url o nombre de archivo>
formato_origen: <WxH · aspect · fps · duracion>
dimensiones: [tipografia, hook, cortes, movimiento, color, sonido]
ejecucion: final-cut-pro / splicekit
---

# Estilo: <nombre legible>

## En una linea
<La tesis del estilo en ≤25 palabras. Si no puedes decirla en una linea, no lo entendiste todavia.>

## Cuando usar este perfil
<Para que tipo de pieza sirve y para cual no. Un estilo de reel de 20s no se estira a un brand film de 2 min.>

---

## 1. TIPOGRAFIA Y TEXTO EN PANTALLA

**Observado**
- [OBSERVADO] Familia: <sans/serif/condensada/mono>, peso <ligero/medio/black>, <mayusculas/mixtas>
- [OBSERVADO] Tamaño: <fraccion de la altura del cuadro, ej. "titular ≈ 1/8 del alto">
- [OBSERVADO] Anclaje: <abajo-izquierda / centrado / tercio superior> · margen ≈ <% del ancho>
- [OBSERVADO] Densidad: <n> palabras max por tarjeta, <n> lineas max
- [OBSERVADO] Permanencia: <X>s en pantalla (<N> frames)
- [OBSERVADO] Tratamiento: <sombra / caja solida / sin fondo / contorno>

**Regla**
> <La regla accionable, en imperativo. Ej: "Maximo 3 palabras por tarjeta, en caja alta, ancladas al tercio inferior izquierdo con margen del 8%. Nunca centrado.">

**Ejecucion (splicekit / FCP)**
- `insert_title` por tarjeta; posicion y escala via `set_inspector_property`
- Si el texto sigue al hablado: `generate_captions` + `set_caption_style`, y `set_caption_grouping` para forzar el maximo de palabras
- Verificar con `capture_viewer` — la tipografia es lo que mas se rompe al trasladar

---

## 2. HOOK / APERTURA

**Observado**
- [MEDIDO] Primer corte en el frame <N> (<X>s)
- [OBSERVADO] Que aparece primero: <texto / sujeto / producto / plano de contexto>
- [OBSERVADO] Estructura de los primeros <X>s: <descripcion beat por beat>
- [MEDIDO] Densidad de corte en los primeros 3s vs resto: <X>/s vs <Y>/s

**Regla**
> <Ej: "Corte antes del segundo 0.5. El texto entra antes que la imagen se lea. Nada de plano establecedor.">

**Ejecucion**
- `blade_at_times` con los timestamps del hook
- `set_timeline_range` a los primeros 3s para iterar sin renderizar todo

---

## 3. CORTES Y RITMO

**Observado**
- [MEDIDO] ACL <X>s · mediana <Y>s · rango <min>-<max>s
- [MEDIDO] <N> cortes · <X>/min
- [MEDIDO] Coeficiente de variacion <X> → <metronomico/consistente/variable/caotico>
- [MEDIDO] Beat: <detectado ~<BPM> BPM, <X>% en grid | no detectado — cortes narrativos>
- [MEDIDO] Distribucion: <histograma por bucket>

**Regla**
> <Ej: "Todo corte cae en beat a 120 BPM (0.5s). Los planos duran 1 o 2 beats, nunca 3. Un solo plano largo de 4 beats como respiro, a los dos tercios.">

**Ejecucion**
- Si `beat.detected`: `detect_beats` sobre la pista musical → `beat_sync_blade` → `trim_clips_to_beats`
- Si no: `blade_at_times` con los tiempos derivados de la estructura, no del video original
- `analyze_timeline` para verificar que el ACL resultante cuadra con el objetivo

> **Importante:** los `cut_times_s` del analisis son del video de REFERENCIA. No se copian literal al nuevo timeline — lo que se copia es el **patron** (ACL, distribucion, relacion con el beat).

---

## 4. MOVIMIENTO Y TRANSICIONES

**Observado**
- [MEDIDO] Energia de movimiento <X> → <estatico/sutil/activo/agresivo>
- [OBSERVADO] Tipo: <push-in / handheld / estatico / whip pan / parallax de graficos>
- [OBSERVADO] Transiciones: <corte duro / flash / disolvencia de N frames / match cut>
- [MEDIDO] Pico de energia en <X>s-<Y>s

**Regla**
> <Ej: "Ningun plano completamente fijo — push-in de 2-4% durante todo el plano. Transiciones: corte duro siempre, salvo flash blanco de 3 frames en cambio de bloque.">

**Ejecucion**
- Movimiento sostenido: keyframes de escala/posicion via `set_inspector_property`
- `list_transitions` PRIMERO para ver que existe en esta instalacion, luego `apply_transition`
- `apply_transition_to_all_clips` solo si la regla es verdaderamente uniforme

---

## 5. COLOR Y LUZ

**Observado**
- [MEDIDO] Exposicion: <etiqueta> (luma <X>/255)
- [MEDIDO] Contraste: <etiqueta> (negros <X> → blancos <Y>, rango <Z>)
- [MEDIDO] Saturacion: <etiqueta> (<X>)
- [MEDIDO] Temperatura: <etiqueta> (indice <X>)
- [MEDIDO] Estabilidad de luma entre planos: <X> — <bajo = grade consistente>
- [OBSERVADO] Direccion de luz: <dura lateral / difusa frontal / contraluz / mixta>

**Regla**
> <Ej: "Low-key con negros levantados — nunca negro puro. Temperatura fria en interiores, calida solo en el bloque final. Saturacion contenida salvo el color de marca.">

**Ejecucion**
- `batch_color_correct` para la base sobre todos los clips
- Ajuste por plano solo donde la estabilidad de luma medida sea alta (= el original SI varia)
- Verificar con `capture_viewer` en 3 puntos del timeline

> **No** derives valores de LUT de estos numeros. Se midieron sobre video comprimido a 320px. Sirven de direccion, no de receta.

---

## 6. SONIDO

**Observado**
- [MEDIDO] <X> LUFS integrado · LRA <Y> LU · peak <Z> dBFS → <estandar>
- [OBSERVADO] Capas: <musica sola / musica + VO / musica + VO + SFX>
- [OBSERVADO] Relacion musica-voz: <la musica baja bajo la voz / no baja>
- [OBSERVADO] SFX en cortes: <si/no, que tipo>

**Regla**
> <Ej: "Musica sola, sin voz. Master a -13 LUFS. Whoosh corto en cada cambio de bloque, no en cada corte.">

**Ejecucion**
- `mixer_set_volume` por rol; `assign_role` para separar musica/VO/SFX
- `mixer_apply_bus_effect` para el master

---

## NO HACER

<Lo que este estilo evita explicitamente. Un renglon por punto. Esta seccion previene mas errores que todas las anteriores juntas.>

- <Ej: "No centrar texto — siempre anclado a un borde">
- <Ej: "No usar disolvencias entre planos del mismo bloque">
- <Ej: "No dejar ningun plano por encima de 1.5s">
- <Ej: "No abrir con plano establecedor">

---

## CHECKLIST DE VERIFICACION

Correr al terminar la edicion, antes de exportar:

- [ ] `analyze_timeline` → ACL dentro de <X>±0.2s del objetivo
- [ ] `capture_viewer` en 0:00, mitad y final → grade consistente
- [ ] Ningun plano excede <X>s
- [ ] Texto: max <N> palabras por tarjeta, anclaje correcto
- [ ] Primer corte antes de <X>s
- [ ] Master a <X> LUFS ±1

---

## PROCEDENCIA

- Analisis: `analyze.py` sobre <archivo>, <N> frames leidos a <X>px
- Cortes detectados con threshold <X> — <nota si se sospechan cortes no detectados>
- Dimensiones elegidas por el usuario: <lista>
- Dimensiones descartadas: <lista, para que una version futura sepa que ya se vio y se desecho>
- Limitaciones conocidas de esta extraccion: <ej. "n=1, un solo video de referencia">
```
