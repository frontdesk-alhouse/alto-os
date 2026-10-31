# Guía de Conversación — Intake de Marca

Conducida durante la fase `intake`. No es una encuesta — es una conversación de
discovery. Haz una pregunta a la vez. Usa follow-ups cuando la respuesta sea superficial.
Habla de forma natural, cálida y directa, como un director creativo senior haría con un fundador.

---

## Bloque 1 — La Marca

**Objetivo**: entender el origen, propósito y diferenciador real.

1. Cuéntame cómo nació esta marca. ¿Cuál fue el momento o la razón que la hizo existir?

2. ¿Qué problema resuelve para su cliente? Trata de describirlo como lo describiría el cliente, no como lo describe la empresa.

3. Si le preguntaras a un cliente fiel "¿por qué sigues eligiendo esta marca?", ¿qué crees que respondería?

4. ¿Qué hace esta marca que sus competidores directos no hacen (o no hacen igual)?

5. Si la marca fuera una persona, ¿cómo la describirías? Piensa en su carácter, su actitud, cómo entra a un cuarto.

**Follow-ups útiles**:
- "¿Puedes darme un ejemplo concreto de eso?"
- "¿Qué tan diferente es esto de lo que ya existe?"
- "¿Hay alguna historia o momento que encarne perfectamente el espíritu de la marca?"

---

## Bloque 2 — La Voz

**Objetivo**: definir cómo habla y cómo NO habla la marca.

6. ¿Cómo describirías el tono de voz de la marca en 3 adjetivos? (Ej: directa, cálida, irreverente)

7. Dame un ejemplo de algo que esta marca NUNCA diría. ¿Por qué no lo diría?

8. ¿Cómo cambia el tono según el contexto?
   - En redes sociales vs. en un email formal
   - Al celebrar un logro vs. al manejar una queja
   - Con clientes nuevos vs. con clientes de mucho tiempo

9. ¿Hay alguna marca (de cualquier industria) cuya forma de comunicar admiren? ¿Qué les gusta de cómo habla?

**Follow-ups útiles**:
- "¿Puedes escribirme un ejemplo de mensaje que sí diría esta marca?"
- "¿Qué tan formal o informal quieren sonar?"

---

## Bloque 3 — La Audiencia

**Objetivo**: definir a quién le habla la marca (no NSE — la persona concreta).

10. Descríbeme a la persona principal a la que le habla esta marca. No me digas el segmento — descríbeme a una persona específica: ¿qué hace?, ¿dónde vive?, ¿qué le preocupa?

11. ¿Qué necesita esa persona escuchar o sentir para confiar en esta marca y elegirla?

12. ¿Hay algo que esa persona típicamente duda o cuestiona antes de comprar? ¿Cuál es la objeción más común?

13. ¿Qué aspira a ser o tener esa persona? ¿Cómo encaja esta marca en esa aspiración?

**Follow-ups útiles**:
- "¿Puedes darme un ejemplo de un cliente real que encarne eso?"
- "¿Qué es lo que más valoran: precio, status, calidad, conveniencia, identidad?"

---

## Output: `00-brief.md`

Al finalizar la conversación, escribe este archivo en `brand/00-brief.md`:

```markdown
# Brief de Marca — [Nombre del cliente]
Generado por intake conversacional — [fecha]

## Origen y propósito
[Resumen del origen, momento fundacional, razón de ser]

## Diferenciador real
[Qué hace que sus competidores no hacen, en palabras del cliente]

## Por qué eligen esta marca
[Voz del cliente fiel, no la voz corporativa]

## Carácter de la marca
[Descripción de la marca como persona: actitud, energía, presencia]

## Voz y tono
- Adjetivos: [3 adjetivos]
- Nunca diría: [ejemplo]
- Tono por contexto:
  - Redes sociales: [descripción]
  - Email / formal: [descripción]
  - Celebración: [descripción]
  - Manejo de problemas: [descripción]
- Referencia de voz admirada: [marca + por qué]

## Audiencia principal
[Descripción de la persona concreta, no el segmento]

## Qué necesita escuchar para confiar
[El mensaje central que genera confianza]

## Objeción principal
[La duda más común antes de comprar + cómo la marca la responde]

## Aspiración del cliente
[A qué aspira y cómo la marca encaja en eso]

## Notas adicionales
[Cualquier insight relevante que surgió en la conversación]
```
