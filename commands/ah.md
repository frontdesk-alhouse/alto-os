---
description: "Despachador del Alto House OS. Describe el reto en lenguaje natural y él deduce el estado del cliente, arma el plan de ataque y lo ejecuta o lo propone. Una sola entrada para las 10 etapas — no hay que recordar qué skill ni qué agente lanzar."
argument-hint: "[cliente] — [lo que quieres lograr]"
---

# `/ah` — Despachador Alto House

**Input:** `$ARGUMENTS` — el cliente y el reto, en lenguaje natural.
Ejemplos: `Cliente E — ¿dónde vamos?` · `Cliente A — corre research fase 1` ·
`Dr. García — arranca el brand book`

Tu trabajo **no** es preguntarle al director qué skill quiere. Es deducirlo y decírselo.

---

## Paso 1 — Identificar al cliente

Del texto. Base:

```
~/Alto House/10_Clientes/{ACTIVE,PROSPECTING,NOT CLOSED}/
```

Acepta coincidencias parciales y sin acentos ("garcia" → `Dr. García`). Si hay más de una
coincidencia o ninguna, lista los clientes y pregunta. **No adivines entre dos.**

Si no se nombra cliente y el reto es genérico ("¿qué sigue?"), pregunta cuál.

## Paso 2 — Deducir el estado, no preguntarlo

Sigue el procedimiento de `~/.claude/skills/alto-house/os-router/references/playbooks.md`
(sección "Cómo se deduce el estado del cliente"): `STATUS.md` primero, luego sondeo del filesystem,
luego `.claude/` propio del cliente, luego en qué subcarpeta vive.

Hazlo con **una o dos llamadas de Bash**, no con veinte lecturas. Un `find` con `-maxdepth 2` más
un `wc -l` por carpeta clave basta.

Si `STATUS.md` está viejo o contradice el disco, **dilo y ofrece actualizarlo** antes de seguir.
Un panel desactualizado enruta mal.

## Paso 3 — Mapear el reto a un playbook

Contra la tabla de `references/playbooks.md`. Si mapea a más de uno, escoge el que corresponde a la
etapa donde está el cliente hoy, y menciona el otro.

## Paso 4 — Decidir el modo

Aplica la regla de las cuatro condiciones de `playbooks.md`. Recuerda:

- Escribir en Webflow, Figma, ClickUp, Gmail o Drive → **siempre propone**.
- Sin playbook que mapee → **nuevo** → arma plan desde cero y propone.
- Prerequisitos incompletos → **propone**, diciendo qué falta.

## Paso 5 — Ejecutar o proponer

### Modo directo

Anuncia en 3-5 líneas antes de lanzar: qué playbook es, qué agentes van, qué archivos escribirán y
dónde te vas a detener. Luego lanza. **No pidas OK** — el anuncio es la cortesía, no una pregunta.

**Los agentes de un mismo carril van en un solo mensaje, en paralelo.** Máximo 4. Si hacen falta
más, dos tandas, y dilo.

### Modo propone

Da el plan y espera. Estructura:

> **Estado:** dónde está el cliente y de dónde lo dedujiste.
> **Plan:** los pasos, marcando cuáles van en paralelo.
> **Agentes:** cuáles y por qué cada uno.
> **Gates:** dónde te vas a detener y qué decisión es del director.
> **Costo aproximado:** número de agentes y tandas.
> **Por qué propongo en vez de ejecutar:** cuál de las cuatro condiciones falló.

Una recomendación clara, no un menú de opciones. El director corrige si no le late.

## Paso 6 — Cerrar

Al terminar:
- Di qué archivos se escribieron, con su ruta.
- Si un agente falló o dejó huecos, **dilo** — no lo escondas en un resumen optimista.
- Si el playbook termina en un gate, di explícitamente qué decisión toca y qué opciones hay.
- Ofrece actualizar `STATUS.md` con lo que avanzó. Es lo que mantiene vivo el enrutamiento.

---

## Reglas duras

- **Máximo 4 agentes en paralelo.** Nunca más, aunque el plan lo pida.
- **Los agentes escriben a disco, no al contexto.** Reciben su ruta de salida y devuelven solo un
  resumen. Nunca pegues el cuerpo de un informe en la respuesta.
- **Nunca escribas en un sistema externo sin OK.** Correos siempre como borrador.
- **Nunca saltes un gate**, ni cuando el resultado parezca obvio.
- **No inventes el estado del cliente.** Si el disco no lo dice, pregunta.
- **Respeta el `.claude/` del cliente** sobre las reglas globales.
- Si el playbook es un **gap** (entrega, retainer), dilo en vez de improvisar un skill que no existe.

## Modo consulta

Si el reto es una pregunta y no una orden — "¿dónde vamos?", "¿qué sigue?", "¿qué me falta?" —
responde con el estado y la recomendación de siguiente paso, **sin lanzar nada**. Termina
ofreciendo el siguiente paso concreto.

## Referencias

- `~/.claude/skills/alto-house/os-router/references/playbooks.md` — registro, regla conocido/nuevo, gates
- `~/.claude/skills/alto-house/os-router/references/stage-map.md` — el mapa de 10 etapas
- Skills del OS: `ah-*` en `~/.claude/skills/`
- Agentes de research: `ah-digital-auditor`, `ah-competitive-intel`, `ah-keyword-mapper`,
  `ah-social-listener`, `ah-demand-intel`
