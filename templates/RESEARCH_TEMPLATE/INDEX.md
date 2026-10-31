# RESEARCH TEMPLATE — Alto House
> Metodología: Doble Diamante + Market Research Skill (ECC)
> Objetivo final: **Estrategia** (1 oración) → **Pilares** (máx. 5) → **Accionables** (tabla priorizada)

---

## Cómo usar este template

**Para un nuevo cliente:**
1. Copia esta carpeta completa a `clientes/[nombre-cliente]/Research/`
2. Llena `00_BRIEF.md` con la información del cliente
3. Abre Claude Code y empieza con la Fase 1

**Comandos para Claude (por fase):**
```
Fase 1:  "Lee 00_BRIEF.md y ejecuta la Fase 1 de [cliente]."
Fase 2:  "Lee 00_BRIEF.md y 01_DESCUBRIR.md. Ejecuta la Fase 2 de [cliente]."
Fase 3:  "Lee 00_BRIEF.md y 02_DEFINIR.md. Ejecuta la Fase 3 de [cliente]."
Fase 4:  "Lee 00_BRIEF.md y 03_DESARROLLAR.md. Ejecuta la Fase 4 de [cliente]."
```

**Skills requeridos:**
- `/web-scraper` — scraping de sitios web
- `market-research` — rigor en investigación
  ```
  npx skills add https://github.com/affaan-m/everything-claude-code --skill market-research
  ```

---

## Archivos de este template

| Archivo | Contenido | Quién llena |
|---------|-----------|-------------|
| [INDEX.md](INDEX.md) | Este archivo — mapa y estado | Equipo |
| [00_BRIEF.md](00_BRIEF.md) | Brief del cliente + Estándares | **Equipo (antes de iniciar)** |
| [01_DESCUBRIR.md](01_DESCUBRIR.md) | Fase 1 — Research y scraping | Claude |
| [02_DEFINIR.md](02_DEFINIR.md) | Fase 2 — Diagnóstico y problem statement | Claude |
| [03_DESARROLLAR.md](03_DESARROLLAR.md) | Fase 3 — Enfoques estratégicos | Claude |
| [04_ENTREGAR.md](04_ENTREGAR.md) | Fase 4 — Estrategia + Pilares + Accionables | Claude |

---

## Estado del proceso (actualizar al avanzar)

| Fase | Estado |
|------|--------|
| Brief llenado | ⏳ Pendiente |
| Fase 1 — Descubrir | ⏳ Pendiente |
| Fase 2 — Definir | ⏳ Pendiente |
| Fase 3 — Desarrollar | ⏳ Pendiente |
| Fase 4 — Entregar | ⏳ Pendiente |

---

## Por qué este formato en archivos separados

Cada sesión de Claude solo carga el archivo que necesita, sin saturar el caché con información de fases anteriores. El brief siempre está disponible en `00_BRIEF.md` como referencia ligera.

---

*Template v1.1 — Alto House × Claude Code | Doble Diamante + Market Research Skill (ECC)*
