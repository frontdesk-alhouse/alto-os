---
name: nano-banana
description: Renderiza imágenes vía la extensión nanobanana del Gemini CLI (gemini-2.5-flash-image, gemini-3-pro-image). Úsalo como MOTOR DE EJECUCIÓN cuando la dirección de arte YA está definida — por brandkit, imagegen-frontend-web, imagegen-frontend-mobile, banner-design, design o image-to-code. NO decide criterio visual: recibe un prompt ya dirigido y lo renderiza. Si el usuario pide una imagen sin dirección de arte previa, carga primero el skill correspondiente y usa este al final para producir el archivo.
allowed-tools: Bash(gemini:*)
---

# Nano Banana — motor de render

Ejecuta la generación de imagen. **No** define dirección de arte.

## Posición en el flujo

```
Dirección de arte          →  Render
(brandkit, imagegen-*,        (este skill)
 banner-design, design)
```

- **Con dirección previa:** recibe el prompt ya construido y lo renderiza tal cual.
- **Sin dirección previa:** carga primero el skill de dirección que corresponda al encargo. Solo salta ese paso si el usuario pide explícitamente un render crudo o una prueba rápida.
- Este skill nunca inventa paleta, tipografía ni composición por su cuenta. Ese criterio vive en los skills de dirección y, para trabajo de cliente, en el design system del proyecto.

## Antes del primer uso

1. Extensión instalada:
   ```bash
   gemini extensions list | grep nanobanana
   ```
   Si falta, se instala **de forma interactiva** (pide confirmación, no corre headless):
   ```bash
   gemini extensions install https://github.com/gemini-cli-extensions/nanobanana
   ```

2. Credenciales. Esta máquina va por **API key** (`security.auth.selectedType: "gemini-api-key"` en `~/.gemini/settings.json`). La key vive en `~/.gemini/.env` bajo dos nombres, `GEMINI_API_KEY` y `NANOBANANA_GEMINI_API_KEY`, porque el CLI y la extensión piden nombres distintos.

   **No intentes cambiar esto a OAuth.** Google descontinuó Gemini Code Assist for individuals en el Gemini CLI; el login con Google falla con `IneligibleTierError` y remite a Antigravity. La API key es la única vía funcional.

   No verifiques con `[ -n "$GEMINI_API_KEY" ]` desde Bash — la variable vive en el `.env`, no exportada al shell, y daría un falso negativo. El CLI la carga solo.

   **Esto se cobra por uso.** No hay suscripción que lo cubra por esta vía.

## Comandos

Siempre con `--yolo` para evitar prompts de confirmación que cuelgan la ejecución.

| Comando | Uso |
|---|---|
| `gemini --yolo "/generate 'prompt'"` | Texto a imagen |
| `gemini --yolo "/edit archivo.png 'instrucción'"` | Modificar imagen existente |
| `gemini --yolo "/restore foto.jpg 'quitar rayones'"` | Restaurar fotos |
| `gemini --yolo "/icon 'descripción'"` | Iconos, favicons |
| `gemini --yolo "/diagram 'descripción'"` | Diagramas, flujos |
| `gemini --yolo "/pattern 'descripción'"` | Texturas repetibles |
| `gemini --yolo "/story 'descripción'"` | Secuencias narrativas |

Si el directorio no es confiable, agrega `--skip-trust`.

## Opciones

- `--count=N` — N variantes (1–8)
- `--aspect=16:9` — proporción
- `--preview` — abre el resultado
- `--styles="estilo1,estilo2"` — estilos
- `--seed=N` — reproducibilidad
- `--format=grid|separate` — arreglo de salida

## Medidas frecuentes

| Uso | Medida | Nota |
|---|---|---|
| Thumbnail YouTube | 1280×720 | `--aspect=16:9` |
| Featured de blog | 1200×630 | Buen preview social |
| Social cuadrado | 1080×1080 | Instagram, LinkedIn |
| Header X/Twitter | 1500×500 | Banner ancho |
| Story vertical | 1080×1920 | `--aspect=9:16` |

## Modelo

Default `gemini-2.5-flash-image`. Para mayor calidad:

```bash
export NANOBANANA_MODEL=gemini-3-pro-image-preview
```

**Costo:** se cobra por imagen contra la API key (~$0.04 en flash, más en pro). No hay suscripción que lo cubra. Ante error de cuota o facturación, repórtalo al usuario en vez de reintentar en bucle — cada reintento puede ser un cargo. Para lotes grandes, confirma con el usuario antes de disparar.

## Render desde manifiesto (flujo brand-to-website)

El workflow `brand-to-website` produce `<outputDir>/assets/manifest.json` con todas las
imágenes que el sitio necesita, ya con prompts dirigidos por el design system, y construye
el HTML referenciando esas rutas. Los archivos no existen hasta que se renderizan aquí.

**Este paso requiere aprobación explícita del usuario** — cuesta dinero por imagen. Nunca
lo dispares por iniciativa propia: presenta el manifiesto con el conteo y el costo estimado,
y espera el visto bueno.

### Coherencia de serie — el riesgo #1

El modelo **no tiene memoria entre invocaciones**. Nueve llamadas son nueve encargos distintos:
la temperatura de color deriva, la luz cambia de dirección, el grano y la saturación saltan, y a
media página el "estilo" migra de fotografía a render 3D. Pedirle coherencia al agente en el prompt
no es un mecanismo — es una esperanza. Estos sí lo son:

1. **`SERIES_STYLE` congelado.** El manifiesto trae un párrafo único —medio, lente, luz,
   temperatura, grano, saturación, hex de la paleta, tratamiento de sombras— escrito **una sola
   vez para todo el sitio**. El prompt de cada asset es concatenación **mecánica**:
   `SERIES_STYLE + "\n" + específico-del-slot`. No lo reescribas ni lo "adaptes" por imagen: en el
   momento en que cada asset tiene su propia descripción de luz, la serie se rompe.
2. **`--seed` fijo para toda la serie.** No garantiza coherencia con prompts distintos, pero reduce
   la varianza.
3. **Genera menos.** La mejor coherencia son 3 imágenes en vez de 9. Gradientes, patrones y
   texturas derivables de tokens se construyen **nativos en Figma o en CSS**: costo cero, cero
   deriva. Reserva el render para los 2-3 slots que de verdad cargan la página.
4. **`gemini-3-pro-image` para esos 2-3 slots.** Flash falla en caras y manos. Ajusta el estimado
   de costo si los usas — la cuenta de $0.04 por imagen deja de valer.

### Ejecución del lote — secuencial, sin excepción

```bash
gemini --yolo --skip-trust "/${command} '${SERIES_STYLE}\n${prompt}' --aspect=${aspect} --seed=${seed}"
```

Por cada entrada, en este orden estricto: **renderiza → verifica que el archivo existe y tiene
bytes → muévelo de `./nanobanana-output/` a la ruta `file` del manifiesto → recién entonces pasa
a la siguiente.**

No dispares el lote en paralelo. Si ocho imágenes caen juntas en `nanobanana-output/`, asignar
archivo→slot es adivinar, y adivinar mal significa la foto equivocada en la sección equivocada.
Eso ya pasó en un proyecto real por subir en paralelo a Figma.

Reglas del lote:
- Una variante por asset salvo que el usuario pida opciones. `--count=3` triplica el costo.
- Si una imagen falla, sigue con las demás y repórtala al final. No reintentes en bucle.
- Ante error de cuota o facturación, **detén el lote completo** e informa — el resto de
  reintentos también se cobrarían.
- Al terminar: reporta cuántas se generaron, cuántas fallaron y el costo real aproximado.

## Salida

Todo cae en `./nanobanana-output/` del directorio actual. Al terminar: lista la carpeta, muestra el archivo más reciente y ofrece variantes.

## Iteración

- "otra vez" / "dame opciones" → `--count=3`
- "más [adjetivo]" → ajusta el prompt y regenera
- "edita esta" → `/edit nanobanana-output/archivo.png 'ajuste'`
- "otro estilo" → agrega `--styles="..."`

## Prompts

1. Específico: estilo, ánimo, color, composición.
2. Agrega `no text` si no quieres tipografía renderizada — el modelo la deforma con frecuencia.
3. Ancla el estilo: "editorial photography", "flat illustration", "3D render", "watercolor".
4. Menciona el encuadre: "wide banner", "square thumbnail", "vertical story".

## Problemas

| Síntoma | Causa |
|---|---|
| Pide método de auth | Falta `security.auth.selectedType` en `~/.gemini/settings.json` |
| "not running in a trusted directory" | Agrega `--skip-trust` |
| Extensión no encontrada | Instálala interactivamente (ver arriba) |
| Cuota excedida | Reporta al usuario; no reintentes en bucle |
| Falla la generación | Revisa el prompt por violación de políticas; simplifica |
