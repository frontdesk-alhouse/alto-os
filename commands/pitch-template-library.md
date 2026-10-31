---
description: Build the Alto House pitch-deck template library in Figma — extract real slide patterns from a source deck (Fase A) and originate the missing ones from scratch (Fase A2), all governed by the target file's own Reglas de Construcción.
---

Parse the following from $ARGUMENTS:
1. `--source-file <fileKey|url>` — (optional, default `<fileKey>`) the real, already-delivered deck to extract client-facing template patterns from
2. `--target-file <fileKey|url>` — (optional, default `<fileKey>`, "Alto House — Pitch Deck Template") where the library gets built
3. `--max-iterations N` — (optional, default 3) maximum generator-evaluator cycles per template
4. `--pass-threshold N` — (optional, default 8.0) weighted score to pass
5. `--include-originated` — (optional, default true) also run Fase A2 (the 4 templates with no source slide to clone)
6. `--include-internal-brand-slides` — (optional, default true) also extract the 2 internal brand-spec slides (logo clearspace, type specimen) onto a separate `Alto House Internal` page

## Pitch Template Library — Figma-to-Figma extraction

This is the same generator↔evaluator engine used by `/clone-to-figma`, retargeted at Figma-to-Figma extraction instead of website cloning. Because every Figma MCP tool takes an explicit `fileKey`, there is no browser, no reference-capture phase, and no separate recon agent — reading the source and writing the target happen in the same `figma-clone-generator` invocation, per template.

### Phase 0: Setup

1. Resolve `--source-file`/`--target-file` to fileKeys (strip a `https://figma.com/design/<fileKey>/...` URL down to the key if a URL was passed).
2. Create `pitch-template-harness/{research/templates/,feedback/}`.
3. In the target file, confirm or create two pages: `Templates` (client-facing library) and `Alto House Internal` (internal brand-spec utility slides — only if `--include-internal-brand-slides`).
4. Read `32:2` ("Reglas de Construcción") in the target file fresh — this is the fidelity contract every template must satisfy, never work from a paraphrase of it.
5. Read the target file's Foundations (color styles, type ramp, Variable collection) via `get_variable_defs`/`get_design_context`.
6. Verify each of the known source node IDs below still exists via `get_metadata` on the source file — if any moved or were deleted, stop and report which ones before proceeding (don't silently skip or guess a replacement).
7. Log the final template list (client-facing + internal + originated) and the explicitly excluded items (see Phase 1) so the final report is self-documenting.

### Known source template mapping (client-facing, Fase A)

| # | Template name | Source nodeId | Notes |
|---|---|---|---|
| 01 | Portada | `4:99` | `11:693` is a near-duplicate instance — inspect it only to confirm which fields vary (e.g. optional eyebrow), don't build it separately |
| 02 | Contenido / TOC | `5:151` | Cluster Stack of 5 — Regla 7 applies |
| 03 | Membresía / Detalle de Tier | `9:422` | The literal Regla 7 reference slide (3-item stack) — also extract the circular "tarjeta de perfil" motif as a reusable sub-component |
| 04 | Topic Split (2 columnas Q&A) | `6:268` | Uneven 5-block/2-block columns — exercises Regla 6's fallback-spacing formula |
| 05 | Banda de Imagen + Lista 2-Col | `10:123` | |
| 06 | Imagen + Cuerpo | `10:295` | |
| 07 | Timeline / Scope de Trabajo | `66:6` | The literal Regla 4 reference slide |
| 08 | Banda de Contrato / 4 Columnas | `10:88` | |

### Known internal brand-spec slides (Fase A, only if `--include-internal-brand-slides`)

| # | Template name | Source nodeId | Target page |
|---|---|---|---|
| I1 | Logotype / Type Specimen | `4:2` | `Alto House Internal` |
| I2 | Logo Clearspace | `4:32` | `Alto House Internal` |

These represent Alto House's own brand documentation, not client content — extract under the same Reglas de Construcción, but skip the client-name genericization step (Alto House's own name/branding stays as-is).

### Explicitly excluded, not built

- 4 unparented loose rectangles in the source file (`5:127`, `9:446`, `58:3`, `58:4`) — abandoned image placeholders, not real slides. Log as discarded in the final report, do not dignify as templates.

### Phase 1: Template Build Loop (Fase A — per template, parallel)

For each of the 8 client-facing templates and 2 internal-brand slides:

```
iteration = 1
while iteration <= max_iterations:

    # GENERATE — extraction + build in one pass
    Launch figma-clone-generator via the Task tool:
    - Mode: extract (Figma-to-Figma — read source nodeId in source fileKey via get_design_context/get_metadata,
      build in target fileKey on the Templates or Alto House Internal page)
    - Read Reglas de Construcción (32:2) fresh in the target file, apply every rule that's relevant to this template
    - Bind every color/type value to the target file's existing Foundations Variable collection — never a raw hex
    - Genericize client-specific copy (Cliente C, "Membresía Sahara", real prices/dates) into
      comparable-length Spanish placeholders — skip this step for the 2 internal-brand slides
    - Apply the 4 known Figma gotchas (opaque-white default fills, .webp silent-blank bug, per-side-stroke
      divider via separate RECTANGLE, .remove() re-verify)
    - Write a short traceability note to pitch-template-harness/research/templates/<NN>-<slug>.md: which
      rules applied and how (e.g. "Regla 7: stack of 3, total height 856px → 285.3px/slot")
    - If iteration > 1: read feedback/<template>/feedback-{iteration-1}.md and address every issue

    # EVALUATE — rule-compliance rubric, not visual "looks right"
    Launch figma-clone-evaluator via the Task tool:
    - Score against the Figma Fidelity Rubric below (a template's N/A rules redistribute their weight
      proportionally across the applicable rules, never scored as 0)
    - Write feedback to pitch-template-harness/feedback/<template>/feedback-{iteration}.md

    # CHECK SCORE
    Read feedback-{iteration}.md, extract weighted total
    if score >= pass_threshold: log "<template> PASSED at iteration {iteration}"; break
    if iteration >= 2 and score has not improved since the previous iteration: log "<template> PLATEAU"; break
    iteration += 1
```

Run templates in parallel where the harness allows it (multiple Task tool calls in one message), not sequentially. If an `agent()`/Task call returns null (session interruption — a real, recurring failure mode, not hypothetical), log which template was affected and continue with the rest rather than aborting the whole batch; that template gets flagged as incomplete in the final report, not silently dropped.

### Pitch Fidelity Rubric

| Criterion | Weight | Signal | Regla |
|---|---|---|---|
| Precisión de terminación de líneas | 0.20 | `get_metadata` bounding-box diff vs. adjacent edge/frame/component, tolerance ≤0.05px (Plugin API float noise — not a loosening of the rule) | 1 |
| Convención de márgenes | 0.10 | structural lines span x=0→1920; panel insets numerically match an adjacent element's | 2 |
| Grosor de línea por contexto | 0.10 | `strokeWeight` 1px scaffold vs. 2px timeline | 3 |
| Spec de timeline | 0.15 (N/A unless a timeline template) | tick height/weight/count; connector line vs. text-block bbox non-intersection | 4 |
| Sin líneas dobladas | 0.10 | detect collinear strokes within ~2px, both `visible: true` | 5 |
| Retícula real | 0.15 | `layoutGrids` present, matches 12×10/10px margin/20px gutter/Stretch; element x/width against the 140px-column/88px-row formulas | 6 |
| Cluster Stack de slots iguales | 0.15 (N/A unless a Cluster Stack template) | each item height = total/N, `FIXED`, not hug+space-between | 7 |
| Binding de tokens | 0.10 | `get_variable_defs` — bound, not hardcoded, resolves to a real Foundations token | Foundations |
| Higiene de placeholders | gate, not scored | zero literal client-real strings leaked (client-facing templates only) | — |

### Phase 2: Originated Templates (Fase A2 — only if `--include-originated`)

Same Task-tool loop mechanics as Phase 1, mode: generate (brief-driven, no source reference — same mechanism already used for brief-driven Figma builds in `brand-to-website.js`). Same rubric, minus any source-fidelity concept (doesn't apply — there's nothing to be faithful to).

| # | Template name | Brief |
|---|---|---|
| 09 | Cierre | Closing/thank-you slide with a next-steps call to action |
| 10 | Do/Dont Table | Two-column table contrasting acceptable vs. unacceptable brand executions, check/x marks |
| 11 | Statement Pillars | 3-4 large declarative statements presented as visual pillars/columns |
| 12 | Section Divider | Minimal transition slide marking a new section within the deck, dark background, large section title |

These briefs are standard pitch-deck-pattern assumptions (the user didn't specify exact intent) — flag them clearly in the final report as assumptions to confirm/adjust on review, not settled fact.

### Phase 3: Library Assembly (once, not looped)

Launch `figma-clone-generator` once more (mode: extract, scope: whole-library tidy pass) to lay out all built frames on `Templates` and `Alto House Internal` cleanly (non-overlapping, consistent naming, no cross-template Variable-name collisions), then `get_screenshot` both pages for the final report.

### Phase 4: Summary Report

Write `pitch-template-harness/template-library-report.md`:

```markdown
## Pitch Template Library Report

**Source file:** [url] | **Target file:** [url]

### Score Progression
| Template | Iter 1 | Iter 2 | Iter 3 | Final | Result |
|---|---|---|---|---|---|
| 01 Portada | ... | ... | | X.X | PASS/PLATEAU |
| ... | | | | | |

### Fase A2 — Originated Templates
[same table, plus the assumption note about standard-pattern briefs]

### Internal Brand Slides (Alto House Internal page)
[same table for I1/I2]

### Excluded / Discarded
- [source nodeId]: [why — unparented loose rectangle, not a real slide]

### Known Accepted Gap
Kaftan Serif - Trial is not available in this environment — every template's headings use Fraunces as a
visual fallback. Swap via "Reemplazar fuente" in Figma Desktop before any real client deck ships.

### Remaining Issues (templates that didn't hit threshold)
- [template]: [top unresolved issue from its last feedback file]
```

Display the score table and the target file link to the user.
