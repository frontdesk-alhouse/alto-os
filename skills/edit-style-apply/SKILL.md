---
name: edit-style-apply
description: Carga un Perfil de Estilo de Edicion previamente extraido y lo ejecuta sobre un timeline de Final Cut Pro via splicekit. Usar en la conversacion de EJECUCION, cuando el usuario quiere editar aplicando un estilo ya definido. Trigger explicito: /edit-style-apply
argument-hint: "<nombre-del-perfil> [proyecto de FCP]"
allowed-tools: Bash, Read, AskUserQuestion, Write
user-invocable: true
---

# Aplicar estilo de edicion

Esta skill es la mitad ejecutora. La otra mitad — `edit-style-extract` — produjo un perfil; aqui se usa.

**Precondicion:** Final Cut Pro corriendo con el bridge de splicekit conectado, y material ya importado al timeline.

## Paso 1 — Cargar el perfil

```bash
ls -1 ~/.claude/edit-styles/
```

Si el usuario nombro un perfil, leelo directo. Si no, muestra la lista con la linea "En una linea" de cada uno y deja que elija con `AskUserQuestion`.

Lee el perfil **completo** antes de tocar el timeline. Presta atencion especial a:
- La seccion **NO HACER** — son restricciones duras, no sugerencias
- Las etiquetas `[MEDIDO]` vs `[OBSERVADO]` vs `[INFERIDO]` — un `[INFERIDO]` merece que confirmes con el usuario antes de aplicarlo a ciegas
- **PROCEDENCIA** — te dice que tan solido es el perfil (n=1 vs varios videos)

## Paso 2 — Verificar el bridge y el estado real

```
bridge_status()
get_timeline_clips()
analyze_timeline()
```

Nunca asumas el estado del timeline. Necesitas saber cuantos clips hay, su duracion y el ACL actual antes de decidir donde cortar.

## Paso 3 — Reconciliar perfil contra material

Este es el paso que se salta y arruina el resultado. **El perfil describe un video que no es este.** Antes de ejecutar, reconcilia:

| Choque | Que hacer |
|---|---|
| El perfil pide ACL 0.6s y solo hay 4 clips para 60s | Decirlo. No hay material para ese ritmo; o se consigue mas, o se ajusta el objetivo. |
| El perfil es beat-driven y no hay pista musical | Preguntar por la musica. Sin ella, el nucleo del estilo no se puede reproducir. |
| El perfil es 9:16 y el proyecto es 16:9 | Preguntar. Los anclajes tipograficos no se traducen entre aspectos. |
| El perfil pide grade low-key y el material esta sobreexpuesto | Se puede acercar, no igualar. Decir el limite. |

Reporta los choques **antes** de editar, en una lista corta. Luego procede con lo que si aplica.

## Paso 4 — Ejecutar por capas, verificando cada una

Orden fijo. Cada capa depende de que la anterior este bien:

### 4.1 Ritmo (primero — define la estructura)

Si el perfil dice beat-driven:
```
detect_beats(<pista musical>)
analyze_song_structure(...)     # para alinear bloques con secciones de la cancion
beat_sync_blade(...)
trim_clips_to_beats(...)
```

Si es narrativo:
```
blade_at_times([...])           # tiempos derivados de la estructura NUEVA
```

> Los `cut_times_s` del perfil son del video de referencia. **No los copies literal.** Lo que se replica es el patron: ACL objetivo, distribucion de duraciones, relacion con el beat.

Verificar: `analyze_timeline()` → el ACL resultante debe caer en el rango del perfil.

### 4.2 Transiciones y movimiento

```
list_transitions()              # SIEMPRE primero — el perfil no trae nombres de plugin
apply_transition(...)
```

El perfil describe intencion ("flash blanco de 3 frames en cambio de bloque"). Tu mapeas esa intencion a lo que existe en esta instalacion. Si no hay nada equivalente, dilo en vez de sustituir por algo que cambia el caracter.

Movimiento sostenido (push-in, drift) → keyframes via `set_inspector_property`.

Verificar: `capture_timeline()`.

### 4.3 Color

```
list_effects()
batch_color_correct(...)
```

Base uniforme primero, ajuste por plano despues y solo donde el perfil indique que el original varia.

Verificar: `capture_viewer()` en al menos 3 puntos del timeline — inicio, medio, final. El grade es lo que peor se juzga sin ver.

### 4.4 Tipografia

```
insert_title(...)
set_inspector_property(...)     # posicion, escala, anclaje
```

Si el texto sigue al hablado:
```
generate_captions(...)
set_caption_style(...)
set_caption_grouping(...)       # para forzar el maximo de palabras por tarjeta del perfil
```

Verificar: `capture_viewer()` en cada tarjeta. La tipografia es lo que mas se rompe al trasladar entre proyectos — tamaños y margenes no escalan solos entre aspectos.

### 4.5 Sonido

```
assign_role(...)                # separar musica / VO / SFX
mixer_set_volume(...)
mixer_apply_bus_effect(...)     # master al LUFS del perfil
```

## Paso 5 — Checklist del perfil

Corre la seccion **CHECKLIST DE VERIFICACION** del perfil, punto por punto. Reporta cada uno como cumplido o no, con el valor real medido al lado. No reportes "listo" con puntos sin verificar.

## Paso 6 — Retroalimentar el perfil

Si durante la ejecucion descubriste algo que el perfil no decia o decia mal — un choque recurrente, un parametro que no funciono, un nombre de transicion que si existe y sirve — **anotalo al final del perfil** bajo un encabezado `## NOTAS DE EJECUCION`, con fecha. El perfil mejora con el uso; si no se escribe, el mismo tropiezo se repite en el siguiente proyecto.

## Que NO hacer

- No copiar los timestamps de corte del video de referencia al nuevo timeline.
- No inventar nombres de efectos/transiciones. `list_effects` / `list_transitions` primero, siempre.
- No aplicar todas las capas y verificar al final. Se verifica capa por capa; un error de ritmo invalida todo lo que se construyo encima.
- No ignorar la seccion NO HACER porque "se veria bien". Es la parte del perfil que el usuario eligio explicitamente.
- No reportar la edicion como terminada si el checklist tiene puntos sin verificar. Di cuales quedaron pendientes y por que.
