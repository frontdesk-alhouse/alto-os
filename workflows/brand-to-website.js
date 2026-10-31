export const meta = {
  name: 'brand-to-website',
  description: 'Referencias de branding + vibes → Design System → Sitemap → Copy → Website completo',
  phases: [
    { title: 'Reference Extraction', detail: 'Tokens y estructura reales extraídos de sitios de referencia (opcional)' },
    { title: 'Brand Extraction', detail: 'Estrategia de marca y dirección visual desde referencias e imágenes' },
    { title: 'Design System', detail: 'Tokens: paleta, tipografía, espaciado, sombras, motion' },
    { title: 'Architecture', detail: 'Sitemap + mapa de secciones por página' },
    { title: 'Copywriting', detail: 'Copy con voz de marca para cada sección en paralelo' },
    { title: 'Assets', detail: 'Manifiesto de imágenes con prompts dirigidos por el design system — render bajo aprobación vía nano-banana' },
    { title: 'SEO & Schema', detail: 'JSON-LD (baseline + vertical), metadata y OG por página, robots para bots de IA y llms.txt: skill alto-house/seo-geo' },
    { title: 'Build', detail: 'Implementación de cada página — HTML estático, o frames Figma verificados si stack=Webflow' },
    { title: 'QA', detail: 'Accesibilidad, performance y consistencia cross-page — HTML o frames Figma según stack' },
  ]
}

// ─── ARGS ──────────────────────────────────────────────────────────────────
// {
//   brief:     string  — Descripción del producto/servicio/marca
//   vibes:     string  — Dirección estética en palabras: "dark luxury editorial",
//                        "swiss brutalist con calidez orgánica", etc.
//   references: string[] — Rutas absolutas a imágenes de referencia en disco
//                          o URLs de imágenes de referencia
//   referenceSites: string[] — URLs de sitios reales a inspeccionar (no clonar) para
//                              extraer tokens/estructura reales como contexto adicional
//                              de marca — reusa figma-clone-recon (Etapa 1). Opcional.
//   stack:     string  — "HTML/CSS/JS" | "React" | "Next.js" | "Vue" | "Webflow"
//   vertical:  string  — "real-estate" | "medical" | "product" | "saas" | "generic" — elige plantilla
//                        de schema markup (default: "generic" = solo baseline). Ver skill
//                        alto-house/seo-geo.
//   pages:     string[] — Nombre de páginas: ["Home", "Servicios", "Nosotros", "Contacto"]
//   outputDir: string  — Ruta absoluta donde escribir los archivos generados (ignorado si stack=Webflow)
//   figmaFileUrl: string — URL de un archivo Figma existente donde construir el Design System
//                          y las páginas (solo si stack=Webflow). Si se omite, se crea uno nuevo.
//   darkMode:  boolean — true para generar variante dark (default: false)
// }

const {
  brief = '',
  vibes = '',
  references = [],
  referenceSites = [],
  stack = 'HTML/CSS/JS',
  vertical = 'generic',
  pages = ['Home'],
  outputDir = '/tmp/brand-to-website-output',
  figmaFileUrl = '',
  darkMode = false,
} = args || {}

if (!brief) {
  log('⚠️  No se proporcionó brief. Pasa args.brief con la descripción del proyecto.')
}

const refBlock = references.length > 0
  ? references.map((r, i) => `Referencia ${i + 1}: ${r}`).join('\n')
  : 'No hay imágenes de referencia — trabaja solo desde el brief y los vibes.'

// ─── SCHEMAS ───────────────────────────────────────────────────────────────

const BRAND_SCHEMA = {
  type: 'object',
  required: ['mood', 'audience', 'personality', 'aestheticDirection', 'avoidPatterns', 'brandVoice'],
  properties: {
    mood: { type: 'string' },
    audience: { type: 'string' },
    personality: { type: 'array', items: { type: 'string' } },
    aestheticDirection: { type: 'string' },
    avoidPatterns: { type: 'array', items: { type: 'string' } },
    brandVoice: {
      type: 'object',
      properties: {
        tone: { type: 'string' },
        register: { type: 'string' },
        avoidWords: { type: 'array', items: { type: 'string' } },
        exampleSentence: { type: 'string' }
      }
    },
    referenceNotes: { type: 'string' },
    signatureElement: { type: 'string' }
  }
}

const TOKEN_SCHEMA = {
  type: 'object',
  required: ['colors', 'typography', 'spacing', 'radius', 'shadow', 'motion', 'cssVars'],
  properties: {
    colors: {
      type: 'object',
      required: ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'textMuted', 'border'],
      properties: {
        primary:    { type: 'string' },
        secondary:  { type: 'string' },
        accent:     { type: 'string' },
        background: { type: 'string' },
        surface:    { type: 'string' },
        text:       { type: 'string' },
        textMuted:  { type: 'string' },
        border:     { type: 'string' },
        extra:      { type: 'array', items: { type: 'string' } }
      }
    },
    typography: {
      type: 'object',
      required: ['displayFont', 'bodyFont', 'scaleBase', 'scaleRatio', 'googleFontsUrl'],
      properties: {
        displayFont:   { type: 'string' },
        bodyFont:      { type: 'string' },
        monoFont:      { type: 'string' },
        scaleBase:     { type: 'string' },
        scaleRatio:    { type: 'number' },
        pairingReason: { type: 'string' },
        googleFontsUrl: { type: 'string' }
      }
    },
    spacing: {
      type: 'object',
      required: ['base', 'scale'],
      properties: {
        base:  { type: 'string' },
        scale: { type: 'array', items: { type: 'string' } }
      }
    },
    radius: { type: 'string' },
    shadow: {
      type: 'object',
      required: ['sm', 'md', 'lg'],
      properties: { sm: { type: 'string' }, md: { type: 'string' }, lg: { type: 'string' } }
    },
    motion: {
      type: 'object',
      required: ['fast', 'normal', 'ease'],
      properties: { fast: { type: 'string' }, normal: { type: 'string' }, ease: { type: 'string' } }
    },
    cssVars: { type: 'string' },
    darkCssVars: { type: 'string' },
    rationaleNotes: { type: 'string' }
  }
}

const SITEMAP_SCHEMA = {
  type: 'object',
  required: ['pages', 'navItems'],
  properties: {
    pages: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'slug', 'purpose', 'sections'],
        properties: {
          name:    { type: 'string' },
          slug:    { type: 'string' },
          purpose: { type: 'string' },
          sections: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name', 'type', 'contentBrief'],
              properties: {
                name:         { type: 'string' },
                type:         { type: 'string' },
                contentBrief: { type: 'string' },
                hasMedia:     { type: 'boolean' },
                hasCTA:       { type: 'boolean' },
                layout:       { type: 'string' }
              }
            }
          }
        }
      }
    },
    navItems:    { type: 'array', items: { type: 'string' } },
    footerLinks: { type: 'array', items: { type: 'string' } }
  }
}

const COPY_SCHEMA = {
  type: 'object',
  required: ['pageName', 'sections'],
  properties: {
    pageName: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'headline', 'body'],
        properties: {
          name:           { type: 'string' },
          headline:       { type: 'string' },
          subheadline:    { type: 'string' },
          body:           { type: 'string' },
          cta:            { type: 'string' },
          ctaSecondary:   { type: 'string' },
          labels:         { type: 'array', items: { type: 'string' } },
          bullets:        { type: 'array', items: { type: 'string' } },
          mediaCaption:   { type: 'string' }
        }
      }
    }
  }
}

// Manifiesto de assets. Se produce SIEMPRE; el render es un paso aparte bajo
// aprobación explícita (nano-banana cobra por imagen y el workflow corre en
// background, donde no puede preguntar).
const ASSET_MANIFEST_SCHEMA = {
  type: 'object',
  required: ['assets', 'totalCount'],
  properties: {
    totalCount: { type: 'number' },
    assets: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'file', 'page', 'section', 'kind', 'prompt', 'width', 'height', 'alt'],
        properties: {
          id:       { type: 'string' },
          file:     { type: 'string', description: 'Ruta relativa desde outputDir, ej. assets/home-hero.png' },
          page:     { type: 'string' },
          section:  { type: 'string' },
          kind:     { type: 'string', enum: ['hero', 'section', 'icon', 'pattern', 'diagram', 'og'] },
          command:  { type: 'string', enum: ['generate', 'icon', 'pattern', 'diagram'] },
          prompt:   { type: 'string', description: 'Prompt completo, ya dirigido por el design system' },
          aspect:   { type: 'string', description: 'ej. 16:9, 1:1, 9:16' },
          width:    { type: 'number' },
          height:   { type: 'number' },
          alt:      { type: 'string', description: 'Alt descriptivo para accesibilidad — nunca vacío ni "image"' },
          priority: { type: 'string', enum: ['critical', 'normal'], description: 'critical = LCP above-the-fold' }
        }
      }
    }
  }
}

const SEO_SCHEMA = {
  type: 'object',
  required: ['pageName', 'title', 'metaDescription', 'jsonLd', 'schemaType'],
  properties: {
    pageName:        { type: 'string' },
    title:           { type: 'string' },
    metaDescription: { type: 'string' },
    ogTags:          { type: 'string' },
    jsonLd:          { type: 'string' },
    schemaType:      { type: 'array', items: { type: 'string' } },
    canonicalNotes:  { type: 'string' }
  }
}

const QA_SCHEMA = {
  type: 'object',
  required: ['pageName', 'passes', 'issues', 'score'],
  properties: {
    pageName: { type: 'string' },
    passes:   { type: 'array', items: { type: 'string' } },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'category', 'description', 'fix'],
        properties: {
          severity:    { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
          category:    { type: 'string', enum: ['a11y', 'performance', 'design', 'seo', 'security'] },
          file:        { type: 'string' },
          description: { type: 'string' },
          fix:         { type: 'string' }
        }
      }
    },
    score: { type: 'number' }
  }
}

const FIGMA_DESIGN_SYSTEM_SCHEMA = {
  type: 'object',
  required: ['fileKey', 'fileUrl'],
  properties: {
    fileKey: { type: 'string' },
    fileUrl: { type: 'string' },
    variableCollectionName: { type: 'string' },
    componentsBuilt: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' }
  }
}

const FIGMA_PAGE_EVAL_SCHEMA = {
  type: 'object',
  required: ['score', 'verdict', 'feedback'],
  properties: {
    score: { type: 'number' },
    verdict: { type: 'string', enum: ['PASS', 'FAIL'] },
    feedback: { type: 'string' }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 0 — REFERENCE EXTRACTION (opcional, solo si referenceSites tiene URLs)
// Reconnaissance-only por sitio de referencia: tokens, topología, comportamientos.
// No construye nada en Figma todavía — alimenta la Fase 1 con contexto real
// extraído en vez de solo imágenes sueltas. Reusa figma-clone-recon (Etapa 1)
// vía agentType, sin duplicar su lógica de extracción.
// ═══════════════════════════════════════════════════════════════════════════

let referenceExtractionBlock = ''

if (referenceSites.length > 0) {
  phase('Reference Extraction')
  log(`Extrayendo tokens y estructura de ${referenceSites.length} sitio(s) de referencia...`)

  const referenceExtractions = await pipeline(
    referenceSites,
    url => agent(`
      Run reconnaissance on ${url} as a brand/design reference for a NEW website project —
      this is not a clone target, it's research. Extract global design tokens (color palette
      with hex values, font choices, spacing/radius conventions, motion feel) and the page's
      section topology.

      Working directory for output: figma-clone-harness/research/<hostname>/

      When done, report back a CONCISE summary (a few lines, not the full spec files): the
      extracted color palette (hex values), font choices, spacing/radius conventions, and a
      one-line description of the overall structure/mood (e.g. "dense editorial grid, sharp
      corners, near-monochrome 2-color palette").
    `, { agentType: 'figma-clone-recon', label: `recon:${url}`, phase: 'Reference Extraction' })
  )

  const extracted = referenceExtractions.filter(Boolean)
  log(`Referencias extraídas: ${extracted.length}/${referenceSites.length}`)

  referenceExtractionBlock = extracted.length > 0
    ? '\n\n' + extracted.map((r, i) => `Referencia extraída de sitio real ${i + 1} (${referenceSites[i]}):\n${r}`).join('\n\n')
    : ''
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1 — BRAND EXTRACTION
// Paralelo: estrategia de marca + dirección visual
// ═══════════════════════════════════════════════════════════════════════════
phase('Brand Extraction')

log('Analizando referencias y brief en paralelo...')

const [brandProfile, designDirection] = await parallel([

  () => agent(`
    Eres un brand strategist senior. Analiza el siguiente brief y material de referencia.

    BRIEF: ${brief}
    VIBES / DIRECCIÓN ESTÉTICA: ${vibes}
    REFERENCIAS:
    ${refBlock}${referenceExtractionBlock}

    Extrae el perfil estratégico de la marca:
    - Audiencia específica: quiénes son, qué valoran, qué los frena
    - Mood emocional que el diseño debe evocar
    - 4-6 rasgos de personalidad de marca concretos (no genéricos como "profesional" o "innovador")
    - Dirección estética precisa
    - Voz de marca: tono, registro, palabras a evitar, frase ejemplo
    - Patrones de diseño AI-genérico que debemos evitar para esta marca específica
    - Notas de las referencias visuales: qué colores, energía, estilo se perciben
    - El elemento firma: la única cosa por la que este sitio será recordado

    Sé específico a este brief. Cero respuestas genéricas.
  `, { label: 'brand:strategy', phase: 'Brand Extraction', schema: BRAND_SCHEMA }),

  () => agent(`
    Eres el design lead de un estudio boutique conocido por dar a cada cliente
    una identidad visual que no puede confundirse con ningún otro.

    BRIEF: ${brief}
    VIBES: ${vibes}
    REFERENCIAS:
    ${refBlock}${referenceExtractionBlock}

    Escribe una dirección de diseño para este proyecto. Incluye:

    1. NOMBRE DEL ESTILO: Sé preciso. No "minimalista moderno". Ejemplo: "editorial suizo con tensión neo-brutalista", "dark luxury con texturas orgánicas y tipografía condensada", "retro-futurismo cálido con grid asimétrico".

    2. 3 RIESGOS VISUALES que vale la pena tomar para esta marca específica.

    3. POR REFERENCIA — qué tomar y qué dejar: para cada referencia, una línea de qué robamos y qué descartamos.

    4. EL ELEMENTO FIRMA: el único elemento memorable que encarna el brief. Descríbelo con suficiente detalle para implementarlo.

    5. ANTI-DEFAULTS: Los 3 looks default de AI ahora mismo son: (a) fondo crema + serif + terracota, (b) negro + verde ácido/vermilion, (c) broadsheet con hairline rules. ¿Cuál es el riesgo de caer en alguno? ¿Cómo lo evitamos?

    Devuelve esto como texto — es tu memo de dirección creativa.
  `, { label: 'brand:design-direction', phase: 'Brand Extraction' })

])

log(`Perfil de marca: ${brandProfile.aestheticDirection}`)
log(`Elemento firma: ${brandProfile.signatureElement}`)

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2 — DESIGN SYSTEM + ARCHITECTURE (paralelo)
// Los tokens y el sitemap se construyen al mismo tiempo
// ═══════════════════════════════════════════════════════════════════════════
phase('Design System')

log('Construyendo tokens y sitemap en paralelo...')

const [tokens, sitemap] = await parallel([

  () => agent(`
    Eres un design systems engineer. Construye el sistema de tokens completo para esta marca.

    BRIEF: ${brief}
    PERFIL DE MARCA: ${JSON.stringify(brandProfile)}
    DIRECCIÓN DE DISEÑO: ${designDirection}
    STACK: ${stack}
    DARK MODE: ${darkMode}

    Reglas:
    - COLORES: 8 valores hex con nombres semánticos. La paleta debe servir la dirección estética — no un default.
      Evita sin justificación explícita: crema+terracota, negro+verde ácido, gris neutro+un acento.
    - TIPOGRAFÍA: display font con carácter + body font complementario, ambos en Google Fonts.
      Escribe la razón del pairing. Genera la URL de Google Fonts con ambas familias.
    - ESPACIADO: unidad base (ej. 8px) + array de 6 pasos en rem
    - RADIO: un valor que refleje la personalidad de marca (sharp=0, redondeado=hasta 1rem)
    - SOMBRA: 3 niveles sm/md/lg en box-shadow syntax
    - MOTION: fast/normal en ms + curva de easing en cubic-bezier
    - cssVars: bloque :root { } completo como string con TODO en custom properties CSS
    ${darkMode ? '- darkCssVars: bloque [data-theme="dark"] { } con overrides de colores para dark mode' : ''}

    Escribe también rationaleNotes: 2-3 líneas explicando por qué esta paleta y tipografía sirven a la marca.
  `, { label: 'system:tokens', phase: 'Design System', schema: TOKEN_SCHEMA }),

  () => agent(`
    Eres un information architect. Crea el sitemap completo y el mapa de secciones de este website.

    BRIEF: ${brief}
    PÁGINAS SOLICITADAS: ${pages.join(', ')}
    PERFIL DE MARCA: ${JSON.stringify(brandProfile)}

    Para cada página:
    - name: nombre legible
    - slug: URL slug (home → 'home', Nosotros → 'nosotros')
    - purpose: el único trabajo de esta página (una oración)
    - sections: 3-7 secciones, cada una con:
      - name: nombre de la sección
      - type: hero | feature | showcase | testimonials | faq | cta | stats | team | pricing | contact | footer
      - contentBrief: qué comunica esta sección (2-3 líneas)
      - hasMedia: si necesita imagen/video/ilustración
      - hasCTA: si tiene llamada a la acción
      - layout: full-width | split | grid | asymmetric | centered

    También define navItems (texto del menú principal) y footerLinks (grupos de links en footer).

    Las elecciones de secciones deben servir a la marca — no una fórmula genérica de landing page.
    El hero es una tesis, no una foto + headline + botón azul.
  `, { label: 'architecture:sitemap', phase: 'Design System', schema: SITEMAP_SCHEMA })

])

log(`Sistema de tokens listo. Primary: ${tokens.colors.primary} | Display: ${tokens.typography.displayFont} / ${tokens.typography.bodyFont}`)
log(`Sitemap: ${sitemap.pages.length} páginas | ${sitemap.pages.reduce((a, p) => a + p.sections.length, 0)} secciones totales`)

// Design System real en Figma — solo si el stack final es Webflow. Reusa
// figma-clone-generator (Etapa 1) en modo "generate": sin sitio de referencia
// que fidelizar, los tokens ya generados arriba son el brief a construir.
let figmaDesignSystem = null

if (stack === 'Webflow') {
  log('Construyendo Design System real en Figma (Variables vinculadas)...')

  figmaDesignSystem = await agent(`
    Mode: generate. Build a Figma Design System from these design tokens — no clone
    reference, this is a brief-driven build.

    ${figmaFileUrl
      ? `Use the existing Figma file at ${figmaFileUrl}.`
      : `No existing Figma file was provided — create a new one first (load the
figma-create-new-file skill, then call create_new_file, name it something like
"${(brief || 'Website').slice(0, 40)} — Design System").`}

    Design tokens — bind every one as a real Figma Variable with a semantic name and correct
    scope (never leave a hardcoded hex sitting unbound):
    ${JSON.stringify(tokens, null, 2)}

    Brand context for component styling decisions (pill vs. sharp buttons, spacing rhythm,
    shadow intensity, etc.):
    Aesthetic direction: ${brandProfile.aestheticDirection}
    Signature element: ${brandProfile.signatureElement}
    Design direction memo: ${designDirection}

    On a page named "Components" (create it if it doesn't exist), build:
    - A Variable collection with every color/spacing/radius token bound, correct scopes per
      property type (FRAME_FILL/TEXT_FILL/STROKE_COLOR/GAP, etc.)
    - Type styles for the display and body fonts at a scale implied by the tokens
    - A Button component (add hover/active variants if time allows)
    - A Card/Surface component reflecting the token's radius and shadow values

    This is generate mode — there is no reference to be faithful to. Push for a distinctive
    result matching the aesthetic direction, not a safe generic default.

    Report back: the file's fileKey, its full URL, the Variable collection name, and a list
    of components built.
  `, { agentType: 'figma-clone-generator', label: 'design-system:figma', phase: 'Design System', schema: FIGMA_DESIGN_SYSTEM_SCHEMA })

  if (!figmaDesignSystem) {
    throw new Error('El agente que construye el Design System en Figma no devolvió resultado (sesión interrumpida o límite alcanzado). Sin un archivo Figma con tokens vinculados, la Fase Build de Webflow no puede continuar — reintenta esta fase.')
  }

  log(`Design System en Figma: ${figmaDesignSystem.fileUrl}`)
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3 — COPYWRITING (paralelo por página)
// marketing-agent principles aplicados con la voz de marca extraída
// ═══════════════════════════════════════════════════════════════════════════
phase('Copywriting')

log(`Escribiendo copy para ${sitemap.pages.length} páginas en paralelo...`)

const copyResults = await pipeline(
  sitemap.pages,
  page => agent(`
    Eres un copywriter que trabaja como brand strategist.
    Escribe todo el copy para la página "${page.name}" de este website.

    MARCA: ${brief}
    PERSONALIDAD: ${brandProfile.personality.join(', ')}
    MOOD: ${brandProfile.mood}
    AUDIENCIA: ${brandProfile.audience}
    VOZ DE MARCA:
    - Tono: ${brandProfile.brandVoice?.tone || ''}
    - Registro: ${brandProfile.brandVoice?.register || ''}
    - Palabras a evitar: ${brandProfile.brandVoice?.avoidWords?.join(', ') || ''}
    - Ejemplo de frase: ${brandProfile.brandVoice?.exampleSentence || ''}

    SECCIONES A ESCRIBIR:
    ${page.sections.map(s => `- ${s.name} (${s.type}): ${s.contentBrief}${s.hasCTA ? ' → necesita CTA' : ''}`).join('\n')}

    REGLAS DE COPY (skill brand):
    - Voz activa siempre. Nombra las cosas por lo que el usuario controla, no por cómo funciona el sistema.
    - Un CTA dice exactamente qué pasa al pulsarlo. "Reservar experiencia", no "Enviar".
    - Sin copy template: nada de "Bienvenido a [Marca]", "Somos apasionados por", "Transforma tu X".
    - Los errores y vacíos son instrucciones, no disculpas.
    - Cada sección tiene un único trabajo. Label labela, body explica, CTA dirige.
    - Específico > inteligente. Concreto > inspiracional.
    - Coincide el registro con la audiencia: ${brandProfile.audience}

    Para cada sección escribe: headline, subheadline (si aplica), body, cta (si aplica), bullets (si aplica).
  `, { label: `copy:${page.slug}`, phase: 'Copywriting', schema: COPY_SCHEMA })
)

log(`Copy completo para ${copyResults.filter(Boolean).length} páginas`)

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3.4 — ASSETS (manifiesto, no render)
// Produce la lista de imágenes que el sitio necesita, con prompts YA dirigidos
// por el design system. NO renderiza: nano-banana cobra por imagen y este
// workflow corre en background, donde no puede pedir aprobación. El Build de
// abajo referencia estas rutas con width/height explícitos, así que las
// imágenes se pueden renderizar después y caen en su lugar sin tocar el HTML.
// ═══════════════════════════════════════════════════════════════════════════
phase('Assets')

const mediaSections = sitemap.pages.flatMap(p =>
  p.sections.filter(s => s.hasMedia).map(s => ({ page: p.name, slug: p.slug, ...s }))
)

log(`${mediaSections.length} secciones piden media. Construyendo manifiesto dirigido...`)

const assetManifest = await agent(`
  Eres director de arte. NO escribes prompts genéricos de stock: traduces un design
  system ya definido en instrucciones de render concretas.

  Construye el manifiesto de imágenes para este sitio.

  DIRECCIÓN ESTÉTICA: ${designDirection}
  MOOD: ${brandProfile.mood}
  AUDIENCIA: ${brandProfile.audience}
  ELEMENTO FIRMA: ${brandProfile.signatureElement}
  PATRONES A EVITAR: ${brandProfile.avoidPatterns.join(', ')}

  PALETA (úsala literalmente en los prompts, por nombre de color y por hex):
  ${JSON.stringify(tokens.colors, null, 2)}

  SECCIONES QUE PIDEN MEDIA:
  ${mediaSections.map(s => `- [${s.page}] ${s.name} (${s.type}, layout ${s.layout}): ${s.contentBrief}`).join('\n')}

  Genera una entrada por sección, MÁS una imagen Open Graph de 1200x630 para la home.

  REGLAS DE PROMPT:
  - Cada prompt describe estilo, composición, luz, paleta y encuadre. Específico, no evocativo.
  - Termina SIEMPRE con "no text" — el modelo deforma la tipografía y el copy ya lo pone el HTML.
  - Ancla el estilo con un término real: "editorial photography", "flat vector illustration",
    "3D render", "risograph print", "architectural photography". Nada de "bonito" o "moderno".
  - La paleta del sitio debe aparecer descrita en el prompt. Si el design system es cálido y
    terroso, el prompt no puede pedir azules corporativos.
  - Coherencia de serie: todas las imágenes del sitio deben parecer del mismo encargo.
    Fija luz, tratamiento y nivel de saturación una vez y repítelo en cada prompt.
  - Prohibido reproducir los patrones a evitar listados arriba.

  RUTAS Y MEDIDAS:
  - file: "assets/<slug-pagina>-<slug-seccion>.png"
  - hero → 1600x900, aspect 16:9, priority "critical"
  - section → 1200x800, aspect 3:2, priority "normal"
  - og → "assets/og-home.png", 1200x630, kind "og"
  - command: "generate" salvo iconos ("icon"), texturas ("pattern") o diagramas ("diagram")
  - alt: descriptivo y útil para lector de pantalla. Nunca vacío, nunca "image" ni "hero".

  Escribe el manifiesto como JSON en ${outputDir}/assets/manifest.json (crea la carpeta)
  y devuélvelo también como tu salida estructurada.
`, { label: 'assets:manifest', phase: 'Assets', schema: ASSET_MANIFEST_SCHEMA })

const assetCount = assetManifest?.assets?.length || 0
const assetCostFlash = (assetCount * 0.04).toFixed(2)

log(`Manifiesto: ${assetCount} imágenes | costo estimado ~$${assetCostFlash} USD (flash) — SIN renderizar, pendiente de aprobación`)

// Índice rápido por sección para que el Build referencie rutas reales.
const assetsBySection = {}
for (const a of (assetManifest?.assets || [])) {
  assetsBySection[`${a.page}::${a.section}`] = a
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3.5 — SEO & SCHEMA (paralelo por página)
// skill alto-house/seo-geo — JSON-LD (baseline + vertical), metadata, OG.
// Corre ANTES de Build para que el stack HTML pueda inyectar el <head>.
// Para Webflow emite artefactos entregables (Figma es solo diseño).
// ═══════════════════════════════════════════════════════════════════════════
phase('SEO & Schema')

log(`Generando schema markup y metadata para ${sitemap.pages.length} páginas (vertical: ${vertical})...`)

const seoResults = await pipeline(
  sitemap.pages,
  (page, _, idx) => agent(`
    Eres un especialista en SEO técnico y schema markup. Carga el skill alto-house/seo-geo
    y usa sus plantillas de references/. Genera la capa SEO de la página "${page.name}".

    NEGOCIO / MARCA: ${brief}
    VERTICAL: ${vertical}   (real-estate | medical | product | saas | generic)
    ES HOME: ${page.slug === 'home' || idx === 0}
    SLUG: ${page.slug}
    PROPÓSITO DE LA PÁGINA: ${page.purpose}
    PERFIL DE MARCA (para Organization): ${JSON.stringify(brandProfile)}
    RUTA DE NAVEGACIÓN (para BreadcrumbList): Inicio → ${page.name}
    COPY REAL DE LA PÁGINA — marca SOLO lo que está aquí, nada inventado:
    ${JSON.stringify(copyResults[idx]?.sections || [])}

    Produce:
    - title: 50-60 caracteres, concepto/keyword al frente, único
    - metaDescription: 120-160 caracteres, honesta, tema natural
    - ogTags: string HTML con meta Open Graph (og:type/title/description/url/image 1200x630/
      locale/site_name) + Twitter card (summary_large_image)
    - jsonLd: string listo para <script type="application/ld+json">. BASELINE SIEMPRE
      (Organization + WebSite si es home; BreadcrumbList si es interior) MÁS el tipo del vertical
      donde aplique (real-estate/medical/product/saas). Combina en @graph si hay varios.
    - schemaType: array con los @type incluidos
    - canonicalNotes: nota de canonical/higiene para esta página

    REGLAS DURAS:
    - El JSON-LD solo refleja contenido VISIBLE en el copy de arriba. Nada inventado (precios,
      reseñas, ratings que no existan).
    - JSON-LD únicamente (nunca Microdata/RDFa). No dupliques la misma entidad.
    - No uses FAQPage/HowTo esperando rich result: ya no existen como resultado visual.
  `, { label: `seo:${page.slug}`, phase: 'SEO & Schema', schema: SEO_SCHEMA })
)

const seoOk = seoResults.filter(Boolean).length
log(`SEO generado para ${seoOk}/${sitemap.pages.length} páginas`)

// Para Webflow: emitir los entregables SEO a disco para pegarlos en el campo Schema / Code Embed.
if (stack === 'Webflow') {
  log('Escribiendo entregables SEO para Webflow...')
  await agent(`
    Escribe un archivo de entregables SEO en ${outputDir}/SEO-DELIVERABLES.md (crea el directorio
    si no existe). Para CADA página incluye: nombre, title, meta description, el bloque OG/Twitter,
    y el bloque JSON-LD dentro de un fence de código listo para copiar al campo Schema de Webflow
    (Page Settings) o a un Code Embed. Al final agrega una sección "Higiene pre-lanzamiento" que
    referencie el checklist del skill alto-house/seo-geo (checklist-lanzamiento.md; dónde va cada cosa por plataforma en references/plataformas.md):
    staging noindex, dominio primario antes del sitemap, formato de canonical, schema en un solo
    lugar, y campos CMS que no bindean (Reference/Multi-reference/Multi-image).
    Agrega también una sección "Bots de IA y llms.txt": el robots.txt propuesto desde
    templates/robots-ai-permitir.txt del skill y un borrador de llms.txt desde
    templates/llms.txt.template, armado con las páginas y descripciones de arriba (marcado como
    borrador a curar; opcional, no es palanca de citas).

    Datos SEO por página (JSON):
    ${JSON.stringify(seoResults.filter(Boolean), null, 2)}
  `, { label: 'seo:deliverables', phase: 'SEO & Schema' })
  log(`Entregables SEO en ${outputDir}/SEO-DELIVERABLES.md`)
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 4 — BUILD (paralelo por página)
// frontend-design + ui-ux-pro-max + ui-styling principles aplicados
// stack === 'Webflow' → Figma Assembly (loop generador/evaluador modo generate)
// stack !== 'Webflow' → HTML estático (comportamiento original, sin cambios)
// ═══════════════════════════════════════════════════════════════════════════
phase('Build')

let pageFiles = []
let figmaAssembly = null
let pagesBuiltCount = 0

if (stack === 'Webflow') {
  log(`Construyendo ${sitemap.pages.length} páginas como frames de Figma (modo generate)...`)

  const buildFigmaPage = async (page, pageCopy) => {
    const maxIterations = 3
    const passThreshold = 7.5
    let feedback = null
    let lastResult = { score: 0, verdict: 'FAIL', feedback: '' }

    for (let iteration = 1; iteration <= maxIterations; iteration++) {
      await agent(`
        Mode: generate. Iteration ${iteration}${feedback ? ' — address the feedback below' : ' — first pass'}.
        Target Figma file: fileKey ${figmaDesignSystem.fileKey}. Build on a page named
        "${page.name}" in that file (create the page if it doesn't exist yet).

        Page purpose: ${page.purpose}
        Sections top to bottom: ${page.sections.map(s => `${s.name} (${s.type}, layout: ${s.layout})`).join(' → ')}

        Copy per section:
        ${JSON.stringify(pageCopy?.sections || [], null, 2)}

        Design tokens: bind every color/spacing/radius value to the existing Variable
        collection in this Figma file — check get_variable_defs first, do not recreate the
        collection, and never leave a hardcoded hex sitting unbound next to it.

        Aesthetic direction: ${designDirection}
        Signature element to genuinely include somewhere on this page: ${brandProfile.signatureElement}
        Patterns to avoid: ${brandProfile.avoidPatterns.join(', ')}

        ${feedback ? `Feedback from the last evaluation — address every point:\n${feedback}` : ''}

        This is generate mode — there is no external reference to be faithful to. Push for a
        distinctive result true to the aesthetic direction, not a generic template layout.
      `, { agentType: 'figma-clone-generator', label: `figma-build:${page.slug}`, phase: 'Build' })

      lastResult = await agent(`
        Mode: generate. Score the page "${page.name}" just built on the Figma page named
        "${page.name}" (file ${figmaDesignSystem.fileKey}) against a Design/Originality/Craft
        rubric — Design Quality weight 0.4, Originality weight 0.3, Craft weight 0.3. There is
        no external reference to compare against; judge against the brief instead: purpose
        "${page.purpose}", aesthetic direction "${designDirection}", and whether the signature
        element ("${brandProfile.signatureElement}") is genuinely present and not just
        described in a text layer.

        Be ruthlessly strict per your usual posture — a passing score means genuinely
        distinctive, on-brief work, not "good for an AI build". Return the weighted score
        (0-10), a verdict ("PASS" if score >= ${passThreshold}, else "FAIL"), and concise,
        actionable feedback for the next iteration if it didn't pass.
      `, { agentType: 'figma-clone-evaluator', label: `figma-eval:${page.slug}`, phase: 'Build', schema: FIGMA_PAGE_EVAL_SCHEMA })

      if (!lastResult) {
        log(`⚠️  Evaluación de "${page.name}" interrumpida (sesión) en la iteración ${iteration} — deteniendo esta página, no se descarta el resto del sitio.`)
        lastResult = { score: 0, verdict: 'FAIL', feedback: 'Evaluación interrumpida — reintentar esta página.' }
        break
      }

      feedback = lastResult.feedback
      if (lastResult.score >= passThreshold) break
    }

    return { page: page.name, slug: page.slug, score: lastResult.score, verdict: lastResult.verdict }
  }

  figmaAssembly = await pipeline(
    sitemap.pages,
    (page, _, idx) => buildFigmaPage(page, copyResults[idx])
  )

  pagesBuiltCount = figmaAssembly.filter(Boolean).filter(r => r.verdict === 'PASS').length
  log(`Páginas construidas en Figma: ${pagesBuiltCount}/${sitemap.pages.length} pasaron el umbral`)
} else {
  log(`Construyendo ${sitemap.pages.length} páginas en paralelo...`)

  pageFiles = sitemap.pages.map(p =>
    `${outputDir}/${p.slug === 'home' ? 'index' : p.slug}.html`
  )

  const buildResults = await pipeline(
    sitemap.pages,
    (page, _, idx) => {
      const pageCopy = copyResults[idx]
      const seo = seoResults[idx]
      const fileName = pageFiles[idx]

      return agent(`
      Eres un frontend developer implementando la página "${page.name}".
      Stack: ${stack}
      Archivo de salida: ${fileName}

      ─── DESIGN SYSTEM ───────────────────────────────────────
      ${tokens.cssVars}
      ${darkMode && tokens.darkCssVars ? tokens.darkCssVars : ''}

      Google Fonts: ${tokens.typography.googleFontsUrl}
      Display font: ${tokens.typography.displayFont}
      Body font: ${tokens.typography.bodyFont}

      ─── DIRECCIÓN DE DISEÑO ─────────────────────────────────
      ${designDirection}

      PATRONES A EVITAR: ${brandProfile.avoidPatterns.join(', ')}
      ELEMENTO FIRMA A IMPLEMENTAR: ${brandProfile.signatureElement}

      ─── COPY DE LA PÁGINA ───────────────────────────────────
      ${JSON.stringify(pageCopy?.sections || [], null, 2)}

      ─── ASSETS DE ESTA PÁGINA ───────────────────────────────
      Estas imágenes están planificadas y sus archivos AÚN NO EXISTEN — se renderizan
      en un paso posterior y caerán exactamente en estas rutas. Referéncialas ya:
      ${page.sections.filter(s => s.hasMedia).map(s => {
        const a = assetsBySection[`${page.name}::${s.name}`]
        return a
          ? `- ${s.name} → src="${a.file}" width="${a.width}" height="${a.height}" alt="${a.alt}"${a.priority === 'critical' ? ' [LCP: loading="eager" fetchpriority="high"]' : ' [loading="lazy"]'}`
          : `- ${s.name} → sin asset asignado, resuelve con CSS (gradiente/forma del design system), NO uses placeholder externo`
      }).join('\n') || '      (ninguna sección de esta página pide media)'}

      - width y height explícitos SIEMPRE, tal cual arriba. Son los que evitan el CLS.
      - Nunca uses Unsplash, picsum, placehold.co ni ningún host externo. Si falta un
        asset, resuélvelo con CSS del propio design system.

      ─── NAVEGACIÓN (de sitemap) ─────────────────────────────
      Nav items: ${sitemap.navItems.join(', ')}
      Página activa: ${page.name}

      ─── SEO / SCHEMA (inyectar TAL CUAL en el <head>) ───────
      <title>: ${seo?.title || page.name}
      Meta description: ${seo?.metaDescription || ''}
      Tags OG / Twitter (pegar dentro del <head>):
      ${seo?.ogTags || ''}
      JSON-LD (pegar dentro del <head> como <script type="application/ld+json">):
      ${seo?.jsonLd || ''}
      Canonical / notas: ${seo?.canonicalNotes || ''}

      ─── REGLAS DE IMPLEMENTACIÓN ────────────────────────────
      ESTRUCTURA:
      - HTML semántico estricto: header/nav/main/section/article/footer
      - Jerarquía de headings correcta: un solo h1, h2 para secciones, h3 para subsecciones
      - Atributos aria-label en nav, aria-labelledby en secciones
      - Todos los img con alt descriptivo

      DESIGN SYSTEM:
      - SOLO usar custom properties del :root — cero colores o tamaños hardcodeados
      - Derivar TODA decisión visual del sistema de tokens
      ${darkMode ? '- Implementar toggle dark/light mode con data-theme="dark" en <html>' : ''}

      PERFORMANCE (reglas web/performance.md):
      - Imágenes con width y height explícitos
      - font-display: swap en @font-face o en la URL de Google Fonts
      - No scripts que bloqueen render
      - Animar solo: transform, opacity, clip-path, filter (con moderación)
      - NUNCA animar: width, height, top, left, margin, padding

      DISEÑO (reglas frontend-design + design-quality.md):
      - No puede parecer un template de Tailwind o shadcn por defecto
      - Demostrar al menos 4 de estos: jerarquía por contraste de escala /
        ritmo intencional en espaciado / profundidad por capas o sombras /
        tipografía con carácter / color semántico no decorativo /
        hover+focus+active diseñados / composición que rompe el grid /
        textura o atmósfera / motion que clarifica el flujo
      - El elemento firma de la marca DEBE estar presente en esta página
      - Gastar la audacia en un lugar. El resto: quieto y disciplinado.

      RESPONSIVO:
      - Funciona en 320px, 768px, 1024px, 1440px
      - Mobile-first en CSS media queries
      - Sin overflow horizontal

      OUTPUT:
      Escribe el archivo HTML completo en ${fileName}.
      El <head> DEBE incluir: <title>, meta description, los tags OG/Twitter y el <script
      type="application/ld+json"> del bloque SEO de arriba (tal cual), más <link rel="canonical">.
      CSS embebido en <style> en el <head>.
      JS mínimo inline en <script> al final del body si se necesita para interacciones.
      No dependencias externas excepto Google Fonts.
    `, { label: `build:${page.slug}`, phase: 'Build' })
  }
)

  pagesBuiltCount = buildResults.filter(Boolean).length
  log(`Páginas construidas: ${pagesBuiltCount}/${sitemap.pages.length}`)
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 5 — QA (paralelo por página)
// a11y-architect + performance-optimizer + design-quality checklist
// ═══════════════════════════════════════════════════════════════════════════
phase('QA')

log('Auditando accesibilidad, performance y consistencia...')

const qaResults = stack === 'Webflow'
  ? await pipeline(
      sitemap.pages,
      (page, _, idx) => agent(`
        Eres un QA engineer especializado en sistemas de diseño Figma y consistencia de tokens.
        Audita la página "${page.name}" en el archivo Figma (fileKey ${figmaDesignSystem.fileKey}).

        Audita los siguientes ejes vía get_metadata / get_variable_defs / get_design_context:

        CONSISTENCIA DE TOKENS:
        - Ningún fill/stroke de color hardcodeado sin bind a una Variable de la colección
          existente (revisa cada nodo relevante, no solo una muestra)
        - Ningún frame/auto-layout con fill blanco opaco por default sin querer — lección
          documentada: figma.createAutoLayout()/createFrame() defaultean a blanco opaco;
          cualquier frame que debería ser transparente necesita fills=[] explícito
        - Tipografía usa las mismas familias/tamaños que el resto del sistema de diseño,
          no fuentes sueltas introducidas fuera de los tokens

        ESTRUCTURA:
        - Jerarquía de auto-layout coherente, sin nodos huérfanos
        - Cadena de ancestros auto-layout intacta para cualquier nodo usando layoutSizing FILL

        DISEÑO (reglas frontend-design + design-quality.md):
        - No parece un template genérico
        - Elemento firma de la marca presente: ${brandProfile.signatureElement}

        Devuelve: lista de checks que pasan, lista de issues con severidad+categoría+fix (usa
        el campo "file" para indicar el nombre de la página de Figma donde está el problema,
        ej. "${page.name}"), y score 0-100.
        Página auditada: ${page.name}
      `, { agentType: 'figma-clone-evaluator', label: `qa:${page.slug}`, phase: 'QA', schema: QA_SCHEMA })
    )
  : await pipeline(
      sitemap.pages,
      (page, _, idx) => agent(`
    Eres un QA engineer especializado en accesibilidad, performance y consistencia de diseño.
    Lee el archivo: ${pageFiles[idx]}

    Audita los siguientes ejes:

    ACCESIBILIDAD (WCAG 2.1 AA) — skill accessibility-audit:
    - Todo img tiene alt descriptivo (no vacío, no "image")
    - Jerarquía de headings lógica y sin saltos (h1→h2→h3)
    - Botones y links tienen labels descriptivos
    - Contraste de color ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande
    - Estados de focus visibles y diseñados (no solo outline default)
    - Navegación por teclado funcional
    - Nav con aria-label, secciones con aria-labelledby

    PERFORMANCE (reglas web/performance.md):
    - Imágenes tienen width y height explícitos (evita CLS)
    - font-display: swap en Google Fonts URL o @font-face
    - Sin scripts de render-blocking en el <head>
    - Solo propiedades compositor-friendly animadas (transform/opacity/clip-path)
    - Sin layout thrashing en JS

    DESIGN SYSTEM:
    - Solo custom properties CSS usadas (no colores hardcodeados)
    - Tokens del design system aplicados correctamente
    - Media queries implementadas (320/768/1024/1440)
    - Sin overflow horizontal

    ANTI-TEMPLATE (design-quality.md):
    - No parece un template default de Tailwind/shadcn
    - Elemento firma de la marca presente: ${brandProfile.signatureElement}
    - Hover/focus/active states diseñados

    SEO + SCHEMA (regla web/seo.md + skill alto-house/seo-geo) — categoría "seo":
    - <title> descriptivo, único, 50-60 caracteres
    - Meta description presente, 120-160 caracteres
    - <link rel="canonical"> presente y absoluto
    - Tags Open Graph presentes (og:title/description/image) + Twitter card
    - Headings jerarquizados (un solo h1)
    - Links con texto descriptivo (no "click aquí")
    - JSON-LD presente en <head>: <script type="application/ld+json"> con @context/@type válidos
    - Tipos esperados para esta página: ${seoResults[idx]?.schemaType?.join(', ') || 'baseline'}
    - VALIDACIÓN DE SCHEMA: el JSON parsea, tiene @context "https://schema.org" y @type; las
      propiedades requeridas del tipo están presentes
    - ANTI-REGLA (crítico): el JSON-LD solo marca contenido REALMENTE VISIBLE en la página.
      Si marca precios/reseñas/datos que no están en el HTML → issue "seo" severidad high.

    Devuelve: lista de checks que pasan, lista de issues con severidad+categoría+fix, y score 0-100.
    Página auditada: ${page.name}
      `, { label: `qa:${page.slug}`, phase: 'QA', schema: QA_SCHEMA })
    )

// Agrupa issues por severidad
const allIssues = qaResults.filter(Boolean).flatMap(r => r.issues || [])
const criticalIssues = allIssues.filter(i => i.severity === 'critical')
const highIssues = allIssues.filter(i => i.severity === 'high')
const avgScore = Math.round(
  qaResults.filter(Boolean).reduce((a, r) => a + (r.score || 0), 0) /
  (qaResults.filter(Boolean).length || 1)
)

log(`QA score promedio: ${avgScore}/100`)
log(`Issues: ${criticalIssues.length} críticos | ${highIssues.length} altos`)

// Fix automático de issues críticos
if (criticalIssues.length > 0) {
  log(`Corrigiendo ${criticalIssues.length} issues críticos...`)

  if (stack === 'Webflow') {
    await parallel(criticalIssues.map(issue => () => agent(`
      Corrige este issue crítico directamente en Figma.

      ARCHIVO: fileKey ${figmaDesignSystem.fileKey}, página "${issue.file || 'desconocida'}"
      CATEGORÍA: ${issue.category}
      PROBLEMA: ${issue.description}
      SOLUCIÓN: ${issue.fix}

      Aplica el fix mínimo necesario vía use_figma. No refactorices nodos no relacionados.
      Verifica que el fix no rompa el binding de tokens ni la cadena de auto-layout.
    `, { agentType: 'figma-clone-generator', label: `fix:${issue.category}:${issue.severity}`, phase: 'QA' })))
  } else {
    await parallel(criticalIssues.map(issue => () => agent(`
      Corrige este issue crítico directamente en el archivo.

      ARCHIVO: ${issue.file || outputDir}
      CATEGORÍA: ${issue.category}
      PROBLEMA: ${issue.description}
      SOLUCIÓN: ${issue.fix}

      Aplica el fix mínimo necesario. No refactorices código no relacionado.
      Verifica que el fix no rompa el design system ni el HTML semántico.
    `, { label: `fix:${issue.category}:${issue.severity}`, phase: 'QA' })))
  }

  log('Issues críticos corregidos.')
}

// ═══════════════════════════════════════════════════════════════════════════
// RESULTADO FINAL
// ═══════════════════════════════════════════════════════════════════════════

return {
  summary: {
    brand: brandProfile.aestheticDirection,
    signatureElement: brandProfile.signatureElement,
    palette: tokens.colors,
    fonts: `${tokens.typography.displayFont} / ${tokens.typography.bodyFont}`,
    stack,
    pagesBuilt: pagesBuiltCount,
    sectionsTotal: sitemap.pages.reduce((a, p) => a + p.sections.length, 0),
    qaScore: avgScore,
    criticalFixed: criticalIssues.length,
    ...(stack === 'Webflow'
      ? { figmaFileUrl: figmaDesignSystem.fileUrl, figmaFileKey: figmaDesignSystem.fileKey }
      : { outputDir, files: pageFiles })
  },
  tokens,
  sitemap,
  // Assets planificados pero NO renderizados. El sitio ya los referencia.
  // Para producirlos: aprobar y correr el render (skill nano-banana).
  assets: {
    pending: assetCount,
    estimatedCostUSD: Number(assetCostFlash),
    manifestFile: `${outputDir}/assets/manifest.json`,
    items: assetManifest?.assets || []
  },
  ...(stack === 'Webflow' ? { figmaAssembly } : {}),
  qa: {
    byPage: qaResults.filter(Boolean).map(r => ({ page: r.pageName, score: r.score, issues: r.issues.length })),
    openHighIssues: highIssues
  }
}
