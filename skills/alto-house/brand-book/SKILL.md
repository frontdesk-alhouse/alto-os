---
name: ah-brand-book
description: "Brand book completo para clientes de Alto House. Requiere research-workflow previo. Orquesta 5 fases: init, intake (voz/tono/personalidad), ideate (back & forth creativo), design-system (Figma DS + globals.css para shadcn/ui) y generate (Figma Slides)."
argument-hint: "init [cliente] | init [cliente] --express | intake [cliente] | ideate [cliente] | design-system [cliente] | generate [cliente]"
metadata:
  author: alto-house
  version: "1.1.0"
---

# Alto House — Brand Book

> Convierte un proceso de branding completo en un Brand Book profesional como Figma Slides.
> El template toma los colores, tipografía y elementos del cliente — el cliente siente que
> es completamente suyo, aunque lo haya producido Alto House.
>
> **Prerequisito**: haber corrido `research-workflow` para este cliente. Sin research no hay
> sustento estratégico. Usa `--express` solo para proyectos urgentes.

---

## Cuándo usar cada subcomando

| Subcomando | Momento en el proceso |
|------------|----------------------|
| `init [cliente]` | Al iniciar el proyecto. Valida research, crea carpetas, muestra checklist |
| `init [cliente] --express` | Proyecto urgente sin research formal. Advierte y pide confirmación |
| `intake [cliente]` | Con brief básico del cliente. Conversación para definir voz, tono, personalidad |
| `ideate [cliente]` | Post-intake. Back & forth creativo: conceptos, logo brief, elementos gráficos |
| `design-system [cliente]` | Con logo + paleta + tipografía listos. Genera DS en Figma + `globals.css` para shadcn/ui |
| `generate [cliente]` | Con design system listo. Genera el Brand Book como Figma Slides |

---

## Flujo completo

```
FASE 0 — RESEARCH (prerequisito)
  ├── /alto-house/research-workflow [cliente] [industria]
  └── Research directo: entrevistas, brief, referencias del cliente
        ↓
FASE 1 — INIT
  /alto-house/brand-book init [cliente]
  → Verifica research existente
  → Crea estructura de carpetas
  → Muestra checklist de mínimos
  → Pregunta industria → sugiere sección Activation
        ↓
FASE 2 — INTAKE
  /alto-house/brand-book intake [cliente]
  → Conversación en 3 bloques (marca / voz / audiencia)
  → Output: /clientes/[cliente]/brand/00-brief.md
        ↓
FASE 3 — IDEACIÓN (back & forth)
  /alto-house/brand-book ideate [cliente]
  → Lee research + brief
  → Propone 3 direcciones conceptuales
  → Iteramos hasta consenso
  → Output: /clientes/[cliente]/brand/02-creative-direction.md
        ↓
  [Diseño visual en Figma por el equipo]
  [Logo, paleta, tipografía, elementos gráficos]
        ↓
FASE 4 — DESIGN SYSTEM
  /alto-house/brand-book design-system [cliente]
  → Lee colors.json + fonts + logo del cliente
  → Output 1: Figma DS (template Severovsky temado con la marca)
  → Output 2: globals.css con CSS variables para shadcn/ui
        ↓
FASE 5 — GENERATE
  /alto-house/brand-book generate [cliente]
  → Lee todos los assets de /brand/ + DS generado
  → Genera Figma Slides con identidad del cliente
  → Output: Brand Book completo (incluye slide de componentes digitales)
```

---

## FASE 1 — INIT

### Instrucciones para Claude

1. **Leer el argumento**: extrae `[cliente]` y detecta si existe el flag `--express`.

2. **Sin `--express`**: verifica si existe research del cliente:
   - Busca en `~/Alto House/clientes/[cliente]/` algún archivo de research-workflow (carpetas `01_DESCUBRIR.md`, `03_DESARROLLAR.md`, o similar).
   - Si NO existe: muestra advertencia y ofrece dos opciones:
     ```
     ⚠️  No encontré research de [cliente] en el sistema.
     El brand book sin research estratégico corre el riesgo de
     verse genérico y no tener un diferenciador claro.

     Opciones:
     [1] Correr research-workflow primero (recomendado)
     [2] Continuar en modo express — acepto que el brand book
         no tendrá sustento del research
     ```
   - Si elige [2]: continúa igual que `--express`.
   - Si existe research: confirma y continúa.

3. **Crear estructura de carpetas**:
   ```
   ~/Alto House/clientes/[cliente]/brand/
   ├── logo/
   ├── fonts/display/
   ├── fonts/body/
   ├── photos/
   ├── referencias/website/
   ├── referencias/branding/
   ├── referencias/paleta-colores/
   ├── referencias/elementos-graficos/
   ├── referencias/animaciones/
   ├── referencias/fotografia/
   ├── referencias/otros/
   └── brand-book/
   ```

4. **Preguntar industria**: muestra lista y pide selección:
   ```
   ¿En qué industria opera [cliente]?
   [1] Hospitality / F&B
   [2] Fashion / Lifestyle
   [3] Professional services
   [4] Tech / Digital
   [5] Retail
   [6] Salud / Wellness
   [7] Otra (describe)
   ```

5. **Mostrar checklist** con estado actual (✓ existe / ✗ falta):
   Ver `references/intake-checklist.md`

6. **Mostrar sección Activation sugerida** según industria:
   Ver `references/industry-modules.md`
   Preguntar: *"¿Quieres agregar, quitar o cambiar algo de la sección Activation antes de continuar?"*
   Guardar la lista final en `brand/activation-items.md`.

---

## FASE 2 — INTAKE

### Instrucciones para Claude

Lee `references/conversation-guide.md` completo antes de empezar.

Conduce la conversación en español, de forma natural y cálida — no es una encuesta,
es una conversación de discovery. Haz una pregunta a la vez. Profundiza con follow-ups
cuando la respuesta sea superficial.

Al terminar los 3 bloques, escribe `00-brief.md` en la carpeta del cliente.
Formato del output: ver `references/conversation-guide.md` sección "Output".

---

## FASE 3 — IDEACIÓN

### Instrucciones para Claude

1. Lee (si existen):
   - Research del cliente: carpeta `/clientes/[cliente]/` — busca archivos del research-workflow
   - `brand/00-brief.md` — el intake
   - Todo lo que haya en `brand/referencias/` — descripciones o nombres de archivos

2. Presenta síntesis en 3-5 puntos: qué debe comunicar la identidad visual según el research.

3. Propone **3 direcciones conceptuales** distintas, cada una con:
   - **Nombre del concepto** (evocador, no genérico)
   - **Metáfora central** (1 frase)
   - **Paleta hipotética** (3-4 colores en palabras + HEX aproximado)
   - **Tipografía sugerida** (display + body, con carácter y razón)
   - **Mood / aesthetic keywords** (5-7 palabras)
   - **Brief de logo** (forma, estilo, qué debe comunicar visualmente)
   - **Elementos gráficos** (patrón, textura, ícono, ilustración — descripción)
   - **Anti-patterns** (qué evitar específicamente para esta marca)

4. Espera feedback. Itera: combinaciones, variantes, más opciones si se pide.
   No avances al lock hasta que haya consenso explícito.

5. Al aprobar, escribe `02-creative-direction.md`:
   Ver estructura en `references/template-structure.md` sección "Creative Direction".

---

## FASE 4 — DESIGN SYSTEM

### Instrucciones para Claude

**Prerequisito**: verifica que existen `colors.json`, carpeta `fonts/`, `logo/` SVGs y `02-creative-direction.md`.
Si falta alguno, muestra qué falta y detente.

Lee `references/design-system-guide.md` completo antes de empezar.

1. **Lee los tokens del cliente**:
   - `brand/colors.json` → paleta completa (HEX + RGB + CMYK + nombres)
   - `brand/fonts/display/` → nombre de la tipografía display y sus pesos disponibles
   - `brand/fonts/body/` → nombre de la tipografía body y sus pesos disponibles
   - `brand/02-creative-direction.md` → aesthetic keywords, mood, anti-patterns

2. **Output 1 — Figma Design System**:
   Carga el skill `figma:figma-use` (prerequisito obligatorio antes de `use_figma`).
   Duplica el template de Severovsky en la cuenta de Figma de Alto House.
   Aplica los tokens del cliente siguiendo `references/design-system-guide.md` sección "Figma".
   Guarda la URL en `brand/brand-book/figma-ds-url.txt`.

3. **Output 2 — `globals.css` para shadcn/ui**:
   Genera el archivo siguiendo `references/design-system-guide.md` sección "shadcn".
   Incluye: variables de color (light + dark), tipografía, radius, sombras.
   Guarda en `brand/brand-book/globals.css`.

4. **Output 3 — Resumen del DS**:
   Escribe `brand/brand-book/design-system-summary.md` con:
   - Tokens de color aplicados (nombre → HEX → variable CSS)
   - Tipografías configuradas
   - Componentes disponibles en el DS de Figma
   - Cómo instalar shadcn/ui con este `globals.css` (3 pasos)

---

## FASE 5 — GENERATE

### Instrucciones para Claude

**Prerequisito**: verifica que existen `00-brief.md`, `02-creative-direction.md` y `brand/brand-book/globals.css`.
Si falta alguno, indica qué fase hay que correr primero.

1. **Leer todos los assets**:
   - `colors.json` → paleta del cliente
   - `fonts/display/` y `fonts/body/` → tipografías
   - `logo/` → variantes de logo disponibles
   - `references/fotografia/` → fotos disponibles
   - `activation-items.md` → lista final de secciones de Activation
   - `00-brief.md` + `02-creative-direction.md` → contenido

2. **Invocar Figma**:
   Carga el skill `figma:figma-use` antes de llamar a `use_figma`.
   Genera los slides siguiendo la estructura de `references/template-structure.md`.

3. **Manejo de imágenes faltantes**:
   Para cada slot de imagen que no tenga foto real en `referencias/fotografia/`:
   - Genera descripción en español para sourcing: qué tipo de foto, sujeto, luz, ambiente
   - Genera prompt en inglés para IA (Midjourney/Firefly): lighting, subject, mood, color palette, composition, ratio
   - Marca el slot como "imagen pendiente" con ambas propuestas

4. **Slide "AI Prompts"** (última slide de la sección Digital):
   Deriva del `00-brief.md` y `02-creative-direction.md`:
   - Prompt fotográfico (Midjourney/Firefly)
   - Prompt de elemento gráfico/ilustración
   - Prompt de copy/voz (para ChatGPT/Claude)
   - Prompt de social media (post completo on-brand)

5. Guarda la URL del archivo Figma generado en `brand/brand-book/figma-url.txt`.

---

## Referencias

| Archivo | Contenido |
|---------|-----------|
| `references/intake-checklist.md` | Checklist de mínimos requeridos + estructura de `colors.json` |
| `references/conversation-guide.md` | Preguntas del intake + estructura del output `00-brief.md` |
| `references/template-structure.md` | Estructura completa de slides + Creative Direction |
| `references/industry-modules.md` | Mapa industria → secciones de Activation + catálogo completo |
| `references/design-system-guide.md` | Cómo aplicar tokens al Figma DS + cómo generar `globals.css` |
