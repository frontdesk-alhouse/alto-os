# Design System Guide — Brand Book

Guía para la fase `design-system [cliente]`. Produce dos outputs:
1. **Figma DS** — template de Severovsky temado con los tokens del cliente
2. **`globals.css`** — variables CSS para shadcn/ui listos para cualquier proyecto web

---

## Por qué dos outputs

| | Figma (Severovsky) | shadcn/ui |
|---|---|---|
| **Para qué** | Diseñar y documentar | Construir en código |
| **Quién lo usa** | Diseñador / estratega | Desarrollador / Claude Code |
| **Produce** | Mockups, pitches, brand book | Websites, CRM, apps, portales |
| **Componentes** | ~15 visuales | 70+ con comportamiento real |
| **Modo oscuro** | Manual | Automático con `.dark` |

Son la misma fuente de verdad en dos formatos. Cambiar los tokens en uno → actualizar el otro.

---

## Template base de Figma

**Archivo**: Free Design System by Severovsky
**Fuente**: https://www.figma.com/community/file/gAUdApze3S9B0yqdOz1A9f
**Páginas**:
- `Thumbnail & Vibes` → tokens: colores, tipografía, grid/spacing, íconos (Phosphor 772+)
- `Components` → 20+ componentes: Buttons, Inputs, Nav, Search, Icon Buttons, Cursors, etc.

---

## FIGMA — Cómo aplicar los tokens del cliente

### Paso 1: Duplicar el template

En Figma: File → Duplicate to your drafts
Renombrar: `[Cliente] — Design System v1.0`
Mover a la carpeta del cliente en Figma.

### Paso 2: Actualizar la paleta de colores

En Figma, ir a `Thumbnail & Vibes` → sección `1. Colors`.

El template tiene estos grupos a reemplazar:

| Grupo en Severovsky | Qué mapeamos aquí |
|--------------------|--------------------|
| `Primary` | Color primario del cliente |
| `Secondary` | Color secundario |
| `Tertiary` | Color de acento |
| `Gray Scale` | Ajustar al neutro del cliente |
| `Accent / Error` | Mantener rojo semántico (#EF4444 aprox) |
| `Accent / Warning` | Mantener amarillo semántico |
| `Accent / Success` | Mantener verde semántico |

**Proceso**:
1. En Local Variables, editar cada token de color con los HEX del `colors.json`
2. Los componentes en la página `Components` se actualizan automáticamente al editar las variables

### Paso 3: Actualizar tipografía

En `Thumbnail & Vibes` → sección `2. Typography`:

| Token | Valor |
|-------|-------|
| Display font family | Tipografía display del cliente (Kaftan, etc.) |
| Body font family | Tipografía body del cliente (Satoshi, etc.) |

Revisar que los tamaños de la escala funcionen visualmente con la nueva tipografía.
Ajustar line-height si la tipografía elegida lo requiere.

### Paso 4: Aplicar el logo

En la página `Components` → frame `Logo`:
- Reemplazar el logo placeholder con los SVGs del cliente
- Verificar que el logo funciona sobre todos los fondos de la paleta (ver slide `Scaling colors` del brand book)

### Paso 5: Limpiar componentes irrelevantes

Eliminar o marcar como "no usar" los componentes que no aplican para el tipo de negocio:
- `Tools` (React, Laravel, etc.) → solo para portafolios tech
- `Cursor` con tipos especiales → solo si el producto digital los necesita

### Paso 6: Nombrar en español (si el cliente es hispanohablante)

Opcional: renombrar frames y variantes clave al español para facilitar el uso del equipo.

---

## shadcn/ui — Cómo generar `globals.css`

### Qué es shadcn/ui

Librería de 70+ componentes React construidos sobre Radix UI (accesibilidad WCAG) y Tailwind CSS.
No se instala como dependencia — el código de cada componente se copia al proyecto.
Un solo archivo `globals.css` aplica los tokens de marca a todos los componentes.

**Repositorio**: https://github.com/shadcn-ui/ui
**Componentes incluidos**: Button, Card, Input, Select, Checkbox, Table, Dialog, Toast, Calendar, Chart, Sidebar, Navigation Menu, Accordion, Tabs, Badge, Avatar, Skeleton, Carousel, Slider, Switch, Tooltip y 50+ más.

### Estructura del `globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ─── Superficies ─────────────────────── */
    --background:             [oklch del fondo principal];
    --foreground:             [oklch del texto principal];
    --card:                   [oklch del fondo de cards];
    --card-foreground:        [oklch del texto en cards];
    --popover:                [oklch del fondo de popovers];
    --popover-foreground:     [oklch del texto en popovers];

    /* ─── Acción primaria ─────────────────── */
    --primary:                [oklch del color primario];
    --primary-foreground:     [oklch del texto sobre primario];

    /* ─── Acción secundaria ───────────────── */
    --secondary:              [oklch del color secundario];
    --secondary-foreground:   [oklch del texto sobre secundario];

    /* ─── Silenciado / neutro ─────────────── */
    --muted:                  [oklch del fondo silenciado];
    --muted-foreground:       [oklch del texto silenciado];

    /* ─── Acento / hover ──────────────────── */
    --accent:                 [oklch del color de acento];
    --accent-foreground:      [oklch del texto sobre acento];

    /* ─── Estado destructivo ──────────────── */
    --destructive:            oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(0.985 0 0);

    /* ─── Estructura ──────────────────────── */
    --border:                 [oklch del borde];
    --input:                  [oklch del fondo de inputs];
    --ring:                   [oklch del focus ring — usar primario];

    /* ─── Tipografía ──────────────────────── */
    --font-display:           '[Tipografía display]', serif;
    --font-body:              '[Tipografía body]', sans-serif;

    /* ─── Radio de bordes ─────────────────── */
    --radius:                 [valor: 0rem=sharp / 0.5rem=medium / 1rem=rounded];

    /* ─── Sidebar (si aplica) ─────────────── */
    --sidebar:                [oklch del fondo del sidebar];
    --sidebar-foreground:     [oklch del texto del sidebar];
    --sidebar-primary:        [igual que --primary];
    --sidebar-accent:         [igual que --accent];
    --sidebar-border:         [igual que --border];
    --sidebar-ring:           [igual que --ring];
  }

  .dark {
    /* ─── Invertir superficies ────────────── */
    --background:             [oklch oscuro];
    --foreground:             [oklch claro];
    /* ... (repetir todos los tokens con valores dark) */
  }
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
  }
}
```

### Convertir HEX a oklch

shadcn/ui usa oklch para los colores (mejor manejo de opacidades y dark mode).
Herramienta de conversión: https://oklch.com/

Fórmula aproximada para convertir:
- HEX → RGB → oklch usando la herramienta
- Formato: `oklch(L% C H)` donde L=lightness, C=chroma, H=hue

### Mapeo de tokens por tipo de marca

| Tipo de marca | --primary | --secondary | --accent | --background | --radius |
|--------------|-----------|-------------|---------|-------------|---------|
| Hospitality/Lujo | color oscuro principal | crema/neutro | terracota/dorado | crema | 0.25rem |
| Tech/Digital | azul/verde | gris claro | color vibrante | blanco | 0.5rem |
| Fashion/Lifestyle | negro/carbón | blanco roto | color de temporada | blanco | 0rem |
| Professional services | azul oscuro | gris | acento moderado | gris claro | 0.375rem |
| F&B/Restaurante | color terroso | crema | rojo/terracota | blanco | 0.5rem |

### Ejemplo: Alto House

```css
:root {
  --background:           oklch(0.92 0.012 75);    /* Crema    #ECE5DA */
  --foreground:           oklch(0.27 0.005 0);     /* Carbón   #3D3D3D */
  --card:                 oklch(0.95 0.008 75);
  --card-foreground:      oklch(0.27 0.005 0);
  --popover:              oklch(0.95 0.008 75);
  --popover-foreground:   oklch(0.27 0.005 0);

  --primary:              oklch(0.33 0.042 168);   /* Verde Bosque #35544E */
  --primary-foreground:   oklch(0.92 0.012 75);    /* Crema */

  --secondary:            oklch(0.90 0.010 75);
  --secondary-foreground: oklch(0.33 0.042 168);

  --muted:                oklch(0.87 0.010 75);
  --muted-foreground:     oklch(0.50 0.005 0);

  --accent:               oklch(0.42 0.120 22);    /* Terracota #9E3A26 */
  --accent-foreground:    oklch(0.92 0.012 75);

  --destructive:          oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);

  --border:               oklch(0.80 0.012 75);
  --input:                oklch(0.88 0.010 75);
  --ring:                 oklch(0.33 0.042 168);   /* Verde Bosque */

  --font-display:         'Kaftan', 'Georgia', serif;
  --font-body:            'Satoshi', 'Arial', sans-serif;

  --radius:               0.25rem;                 /* Premium / sharp */

  --sidebar:              oklch(0.28 0.038 168);   /* Verde Bosque oscuro */
  --sidebar-foreground:   oklch(0.92 0.012 75);
  --sidebar-primary:      oklch(0.33 0.042 168);
  --sidebar-accent:       oklch(0.42 0.120 22);
  --sidebar-border:       oklch(0.38 0.038 168);
  --sidebar-ring:         oklch(0.33 0.042 168);
}

.dark {
  --background:           oklch(0.15 0.025 168);   /* Verde muy oscuro #1A2E2A */
  --foreground:           oklch(0.92 0.012 75);    /* Crema */
  --card:                 oklch(0.19 0.030 168);
  --card-foreground:      oklch(0.92 0.012 75);
  --popover:              oklch(0.19 0.030 168);
  --popover-foreground:   oklch(0.92 0.012 75);

  --primary:              oklch(0.92 0.012 75);    /* Crema como primario en dark */
  --primary-foreground:   oklch(0.33 0.042 168);   /* Verde */

  --secondary:            oklch(0.22 0.030 168);
  --secondary-foreground: oklch(0.85 0.010 75);

  --muted:                oklch(0.22 0.025 168);
  --muted-foreground:     oklch(0.65 0.010 75);

  --accent:               oklch(0.50 0.130 22);    /* Terracota más claro en dark */
  --accent-foreground:    oklch(0.92 0.012 75);

  --border:               oklch(0.25 0.030 168);
  --input:                oklch(0.22 0.030 168);
  --ring:                 oklch(0.92 0.012 75);
}
```

---

## Instalación de shadcn/ui en un proyecto nuevo

```bash
# 1. Crear proyecto Next.js
npx create-next-app@latest [nombre-proyecto] --typescript --tailwind --app

# 2. Inicializar shadcn/ui
npx shadcn@latest init

# 3. Reemplazar el globals.css generado con el del cliente
# (copiar brand/brand-book/globals.css → app/globals.css)

# 4. Agregar componentes según necesidad
npx shadcn@latest add button card input table dialog
npx shadcn@latest add sidebar navigation-menu

# 5. Instalar tipografías (si son Google Fonts)
# En app/layout.tsx: importar desde 'next/font/google'
# Si son fuentes locales (.otf/.ttf): usar next/font/local
```

---

## Slide adicional en el Brand Book — "Sistema Digital"

Al tener el design system listo, agregar esta slide en la sección Digital del brand book:

**Contenido**:
- Captura del Figma DS con los componentes principales temados
- URL del archivo Figma DS
- 3 pasos para instalar shadcn/ui con el `globals.css` del cliente
- Componentes disponibles listos para usar (lista visual)
- Nota: "Este design system garantiza consistencia entre pitches, website y cualquier producto digital"

---

## Outputs del subcomando

| Archivo | Ubicación |
|---------|-----------|
| URL del Figma DS | `brand/brand-book/figma-ds-url.txt` |
| CSS variables | `brand/brand-book/globals.css` |
| Resumen del DS | `brand/brand-book/design-system-summary.md` |
