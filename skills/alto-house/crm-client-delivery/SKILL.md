---
description: "Construye y entrega un CRM personalizado en la nube para un cliente de Alto House — basado en auto-crm (Next.js + TypeScript), con Supabase como base de datos, deploy en Vercel, e integraciones via Zapier/Resend."
argument-hint: "[nombre-cliente] [industria] [opciones: --with-whatsapp --with-email --with-mcp]"
---

# Alto House — CRM Client Delivery

> Workflow completo para construir, personalizar y entregar un CRM en la nube a un cliente.
> Basado en [auto-crm](https://github.com/Hainrixz/auto-crm) — Next.js 16 · React 19 · TypeScript · Tailwind v4 · Drizzle ORM.

**Input**: `$ARGUMENTS` (nombre-cliente, industria, flags opcionales)

---

## Arquitectura del delivery

```
auto-crm (template)
       │
       ▼
~/Projects/[slug]-crm         ← copia local por cliente
       │
       ├── Next.js App         → Vercel (gratis, custom domain)
       ├── Base de datos        → Neon PostgreSQL (gratis, cloud)
       ├── Email digests        → Resend (gratis hasta 3k emails/mes)
       ├── Integraciones        → Zapier (si tiene cuenta) / webhooks directos
       └── Acceso IA            → MCP server (opcional, para el cliente)
```

**Por qué Neon en vez de SQLite local:**
- SQLite solo funciona en un servidor; Neon es serverless y funciona en Vercel Edge/Functions
- Neon tiene free tier permanente (0.5 GB, sin tarjeta de crédito)
- Drizzle ya soporta PostgreSQL, el cambio es mínimo

---

## PASO 0 — Briefing del cliente

Antes de escribir código, recopilar:

```
BRIEFING — CRM para [cliente]
─────────────────────────────
Nombre del negocio:
Industria / tipo de negocio:
Idioma de la interfaz: (español / inglés)
Colores de marca (hex): primario / secundario / acento
Logo disponible: sí/no

Pipeline de ventas (etapas en orden):
  1.
  2.
  3.
  4. (... agregar las que necesite)

Fuentes de leads (de dónde llegan los prospectos):
  □ Instagram  □ WhatsApp  □ Referidos  □ Google Ads
  □ Facebook   □ Sitio web  □ Otro: ___

Integraciones requeridas:
  □ WhatsApp Business (notificaciones de nuevo lead)
  □ Email digest diario
  □ Calendario (Google Calendar / Outlook)
  □ MCP para Claude Desktop del cliente

Entorno de deploy:
  □ Vercel + Neon (recomendado — gratis)
  □ Docker en VPS
  □ Solo local (desarrollo)
```

---

## PASO 1 — Clonar y configurar el proyecto

### 1.1 Clonar el template

```bash
mkdir -p ~/Projects
git clone https://github.com/Hainrixz/auto-crm.git ~/Projects/[slug-cliente]-crm
cd ~/Projects/[slug-cliente]-crm
```

Donde `[slug-cliente]` es el nombre en kebab-case, ej: `casa-nogal-crm`, `dr-garcia-crm`.

### 1.2 Instalar dependencias

```bash
npm install
```

### 1.3 Crear archivo de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local` con los valores reales (ver PASO 2 y 3).

---

## PASO 2 — Migrar de SQLite a Neon PostgreSQL

### 2.1 Crear base de datos en Neon

1. Ir a [neon.tech](https://neon.tech) → crear proyecto gratuito
2. Copiar el `DATABASE_URL` de formato:
   ```
   postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 2.2 Actualizar dependencias

```bash
npm uninstall better-sqlite3 @types/better-sqlite3
npm install @neondatabase/serverless drizzle-orm pg @types/pg
```

### 2.3 Actualizar `drizzle.config.ts`

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### 2.4 Actualizar `src/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

### 2.5 Actualizar tipos en `src/db/schema.ts`

Reemplazar tipos SQLite por PostgreSQL:
- `sqliteTable` → `pgTable`
- `text('id').primaryKey()` → `text('id').primaryKey()`  (igual)
- `integer` → `integer` (igual)
- `real` → `real` (igual)
- Import: `from 'drizzle-orm/pg-core'` en vez de `'drizzle-orm/sqlite-core'`

### 2.6 Ejecutar migración inicial

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

---

## PASO 3 — Personalización para el cliente

### 3.1 Colores y branding

Editar `src/styles/globals.css` o el archivo de tokens CSS:

```css
:root {
  --color-primary: [hex del cliente];
  --color-secondary: [hex del cliente];
  --color-accent: [hex del cliente];
}
```

### 3.2 Configurar el CRM con `/setup`

Abrir el proyecto en Claude Code y ejecutar:

```
/setup
```

El wizard pedirá:
- Tipo de negocio e industria
- Etapas del pipeline (del briefing)
- Fuentes de leads
- Idioma y tema visual

Esto genera `public/crm-config.json` con toda la configuración.

### 3.3 Verificar la configuración generada

```bash
cat public/crm-config.json
```

Ajustar manualmente si algún campo no quedó correcto.

---

## PASO 4 — Integraciones opcionales

### 4.1 WhatsApp Business (--with-whatsapp)

**Via Zapier** (más fácil, sin código):
1. Crear Zap: "WhatsApp mensaje recibido → POST a `/api/webhook`"
2. El webhook ya existe en auto-crm — solo necesita el cuerpo:
   ```json
   { "source": "whatsapp", "name": "{{nombre}}", "phone": "{{número}}", "message": "{{mensaje}}" }
   ```

**Via WhatsApp Business API** (directo):
```bash
# Agregar a .env.local
WHATSAPP_VERIFY_TOKEN=tu-token-secreto
WHATSAPP_ACCESS_TOKEN=token-de-meta
```
El endpoint `/api/webhook` ya maneja la verificación de Meta.

### 4.2 Email digest diario (--with-email)

```bash
# Agregar a .env.local
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_TO=correo-del-cliente@ejemplo.com
EMAIL_FROM=crm@altohouse.mx
```

Activar el cron job en `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/digest",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### 4.3 IA para clasificación de leads (opcional)

```bash
# Agregar a .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
```

Sin este key, el CRM usa scoring por reglas (funciona bien para la mayoría de casos).

---

## PASO 5 — Deploy en Vercel

### 5.1 Preparar el repositorio

```bash
cd ~/Projects/[slug-cliente]-crm
git init
git add .
git commit -m "feat: init CRM para [cliente]"
```

Crear repo privado en GitHub:
```bash
gh repo create [slug-cliente]-crm --private --source=. --push
```
*(Si `gh` no está disponible, crear el repo manualmente en github.com)*

### 5.2 Deploy con Vercel CLI

```bash
npx vercel --prod
```

Durante el proceso de Vercel, configurar las variables de entorno:
- `DATABASE_URL` — string de conexión de Neon
- `RESEND_API_KEY` — si se activó email
- `ANTHROPIC_API_KEY` — si se activó IA
- `WHATSAPP_VERIFY_TOKEN` / `WHATSAPP_ACCESS_TOKEN` — si se activó WhatsApp

### 5.3 Dominio personalizado (opcional)

```bash
npx vercel domains add crm.[dominio-del-cliente].com
```

O configurar subdominio `crm.altohouse.mx/[cliente]` si se prefiere centralizar.

---

## PASO 6 — Configurar MCP para el cliente (--with-mcp)

Si el cliente usa Claude Desktop o Claude.ai, se puede conectar el MCP server directamente a su instancia de Claude para que pueda gestionar el CRM con lenguaje natural.

### 6.1 Exponer el servidor MCP

El servidor MCP corre en el mismo Vercel. Agregar a `vercel.json`:
```json
{
  "functions": {
    "mcp/crm-server.ts": {
      "maxDuration": 60
    }
  }
}
```

### 6.2 Instrucciones para el cliente

Dar al cliente estas instrucciones para su `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "crm-[slug-cliente]": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch", "https://[url-vercel]/mcp/crm-server"],
      "env": {}
    }
  }
}
```

**Las 9 herramientas que el cliente tendrá en Claude:**
- `crm_list_contacts` — listar contactos
- `crm_get_contact` — detalle de un contacto
- `crm_create_contact` — agregar nuevo lead
- `crm_list_deals` — ver oportunidades
- `crm_create_deal` — crear oportunidad
- `crm_move_deal` — mover en pipeline
- `crm_log_activity` — registrar llamada/reunión/email
- `crm_get_pipeline` — vista del pipeline completo
- `crm_get_stats` — estadísticas y métricas

---

## PASO 7 — Control de calidad

Antes de entregar al cliente, ejecutar:

```bash
# 1. Build de producción sin errores
npm run build

# 2. Type checking
npx tsc --noEmit

# 3. Linting
npm run lint
```

Luego usar los skills de ECC:

```
/security-scan          — verificar que no haya secretos expuestos, XSS, inyección SQL
/code-review            — revisión de calidad del código modificado
/react-review           — revisión específica de componentes React/Next.js
```

Checklist mínimo antes del handoff:
- [ ] Build de producción pasa sin errores
- [ ] Variables de entorno NO están en el repositorio
- [ ] `.env.local` está en `.gitignore`
- [ ] Las rutas `/api/*` tienen validación de input
- [ ] El CRM carga en menos de 3 segundos (LCP < 2.5s)
- [ ] Login/acceso protegido si el cliente lo requiere

---

## PASO 8 — Entrega al cliente

### 8.1 Documentación de acceso

Crear un documento con:
```
CRM de [Cliente] — Acceso y configuración
─────────────────────────────────────────
URL: https://[url].vercel.app
Panel de admin: https://vercel.com/dashboard
Base de datos: https://console.neon.tech

Comandos Claude Code disponibles (abrir proyecto en Claude Code):
  /add-lead          — agregar nuevo prospecto
  /analyze-pipeline  — análisis estratégico del pipeline
  /daily-briefing    — resumen ejecutivo del día
  /digest            — enviar digest por email
  /import-contacts   — importar CSV de contactos

Integraciones activas:
  [ ] WhatsApp: [estado]
  [ ] Email digest: [estado]
  [ ] MCP: [estado]
```

### 8.2 Capacitación básica (30 min)

Cubrir con el cliente:
1. Cómo agregar un lead manualmente desde la UI
2. Cómo usar `/add-lead` en Claude Code (flujo conversacional)
3. Cómo interpretar el `/daily-briefing`
4. Cómo mover deals en el pipeline
5. Cómo ver las métricas en `/analyze-pipeline`

---

## Estructura del proyecto generado

```
~/Projects/[slug-cliente]-crm/
├── .claude/
│   ├── commands/          ← slash commands para Claude Code
│   │   ├── setup.md
│   │   ├── add-lead.md
│   │   ├── analyze-pipeline.md
│   │   ├── daily-briefing.md
│   │   └── ...
│   └── settings.json
├── src/
│   ├── app/               ← Next.js App Router
│   ├── components/        ← UI components
│   ├── db/                ← Drizzle ORM (Neon/PostgreSQL)
│   └── lib/               ← Claude AI, scoring, utils
├── mcp/
│   └── crm-server.ts      ← MCP server (9 tools)
├── public/
│   └── crm-config.json    ← configuración del cliente
└── .env.local             ← variables privadas (NO en git)
```

---

## Costos del stack

| Servicio | Plan | Costo |
|---|---|---|
| Vercel | Hobby | **Gratis** |
| Neon PostgreSQL | Free tier (0.5 GB) | **Gratis** |
| Resend email | Free (3,000 emails/mes) | **Gratis** |
| Anthropic API | Pay-per-use | ~$0-5/mes según uso |
| Dominio propio | Namecheap/Cloudflare | ~$10-15/año (opcional) |

**Stack mínimo: $0/mes** hasta el límite del free tier.
Para clientes con volumen mayor, Neon Pro ($19/mes) o Vercel Pro ($20/mes).

---

## Troubleshooting común

### Build falla con error de tipos

```bash
/react-build    — usa el agente build-error-resolver
```

### Error de conexión a Neon en producción

Verificar que `DATABASE_URL` incluya `?sslmode=require` al final.

### MCP no conecta

Verificar que el endpoint `/mcp/crm-server` esté desplegado y accesible con un `curl`.

### Los emails no llegan

Verificar que el dominio del sender esté verificado en Resend (DNS records).

---

## Cómo usar este skill

```
/alto-house/crm-client-delivery "Casa Nogal" "cocinas y baños de lujo"
/alto-house/crm-client-delivery "Dr. García" "medicina estética" --with-whatsapp --with-email
/alto-house/crm-client-delivery "Estudio Forma" "arquitectura y diseño" --with-mcp
```

---

## Integración con otros skills de Alto House

- **Antes** de este skill → `/alto-house/research-workflow` (conocer el negocio del cliente)
- **Durante** el briefing → `/alto-house/market-differentiation` (definir el pipeline correcto)
- **Después** del delivery → `/alto-house/estrategia-light` (ayudar al cliente a captar leads)
