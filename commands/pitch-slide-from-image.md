---
description: Build a new pitch-deck slide from a single reference image — replicate its structural layout exactly, but rebuilt 100% with Alto House's own established tokens and templates. Requires the template library from /pitch-template-library to already exist.
argument-hint: "<image-path> --content <brief-or-path> [--template <name>]"
---

Parse the following from $ARGUMENTS:
1. `image` — path to the reference image (required, positional)
2. `--content <brief-or-path>` — **required**. The actual copy/content for the new slide — a reference image alone has no client copy. If this flag is missing, stop immediately and ask the user for it; do not guess or invent placeholder content.
3. `--template <name>` — (optional) force a specific template from the library instead of letting the generator auto-match
4. `--target-file <fileKey|url>` — (optional, default `<fileKey>`)
5. `--max-iterations N` — (optional, default 3)
6. `--structural-threshold N` — (optional, default 7.0) minimum structural-fidelity-to-image score to pass
7. `--brand-threshold N` — (optional, default 8.0) minimum brand-compliance score to pass

## New Slide From Reference Image

Same generator↔evaluator engine as `/pitch-template-library` and `/clone-to-figma`, with one structural difference: two independent scores gated by AND, not averaged. A slide that nails the reference image's layout but leaks one hex color from that image must FAIL — matching structure is not the same as being on-brand, and this command must never let one compensate for the other.

### Phase 0: Setup

1. Resolve `--target-file` to a fileKey.
2. Confirm the `Templates` page exists in the target file with at least 1 built template — via `get_metadata`. If it doesn't exist or is empty, **stop** and tell the user to run `/pitch-template-library` first. Do not attempt to build a design system inline as a fallback.
3. Validate the `image` path is readable via `Read`.
4. If `--content` was not provided, **stop** and ask the user for it — do not proceed with invented copy.
5. Create `pitch-image-harness/<slug>/` (slug derived from the image filename or `--content` brief).

### Phase 1: Template Match (single pass, not iterative)

Launch `figma-clone-generator` via the Task tool:
- Read the reference image (`Read` tool).
- `get_metadata` on every frame under the target file's `Templates` page.
- Describe the reference image **only in structural terms** — position, proportion, element count, hierarchy (e.g. "title top-left, occupying the top ~20% of height; image right ~45% width, full height; a 3-item bulleted list below the title"). Never describe or reference its colors, fonts, or hex values — that information must not leak into any later step, even as "inspiration."
- Report either a match (`"closest match: 04 Topic Split, similarity: high"`, with the reasoning) or `"no close match — build fresh"`.
- If `--template <name>` was passed, use that template directly instead of auto-matching, but still log the auto-match reasoning for audit (don't skip the analysis just because it's overridden).

### Phase 2: Build/Evaluate Loop — dual rubric, AND gate

```
iteration = 1
while iteration <= max_iterations:

    # GENERATE
    Launch figma-clone-generator via the Task tool:
    - Mode: clone (structural fidelity to the reference image), scoped to a NEW slide in the target file
    - Base: the matched template's actual frame (duplicate + adapt) if Phase 1 found one, else build fresh
    - Every visual decision (color, type, spacing) resolves against the target file's Foundations tokens
      and the Reglas de Construcción grid formulas — NEVER against the reference image's own styling
    - Insert the real content from --content (replacing any template placeholder copy)
    - If iteration > 1: read feedback-{iteration-1}.md and address every issue, per which score it hurt

    # EVALUATE — two independent scores, never blended
    Launch figma-clone-evaluator via the Task tool:
    - Score 1, Structural Fidelity to Reference Image (screenshot-based): position/proportion/element-count/
      hierarchy match ONLY. Do not reward or penalize color/font similarity to the reference image — scoring
      that would be actively wrong for this command's purpose.
    - Score 2, Brand Compliance (deterministic): the exact Pitch Fidelity Rubric from /pitch-template-library
      (Reglas de Construcción 1-7 + get_variable_defs token binding), unrelated to the reference image.
    - Re-verify the generator's own template-match claim from Phase 1 by diffing the built frame's grid/
      column spans against the claimed template's — don't take the self-report at face value.
    - Write feedback to pitch-image-harness/<slug>/feedback-{iteration}.md with both scores shown separately.

    # CHECK — AND gate, not average
    structural_pass = structural_score >= structural_threshold
    brand_pass = brand_score >= brand_threshold
    if structural_pass and brand_pass: log "PASSED at iteration {iteration}"; break
    if iteration >= 2 and neither score improved since the previous iteration: log "PLATEAU"; break
    iteration += 1
```

If the Task tool call returns null (session interruption), log it plainly and stop the loop at the last known state rather than crashing — do not silently treat a null result as a passing or failing score.

### Phase 3: Summary Report

Write `pitch-image-harness/<slug>/report.md`:

```markdown
## New Slide From Image Report

**Reference image:** [path]
**Content brief:** [--content value/path]
**Template used:** [matched template name, or "built fresh"] — match reasoning: [...]

### Score Progression
| Iteration | Structural Fidelity | Brand Compliance | Result |
|---|---|---|---|
| 1 | X.X / 10 | X.X / 10 | ... |
| ... | | | |

### Brand Compliance Breakdown (final iteration)
[same rule-by-rule table as /pitch-template-library's rubric]

### Verdict
PASS (both thresholds met) / FAIL (which score(s) fell short, and the top unresolved issue for each)

### Screenshot
[link to the built slide's screenshot]
```

Display both final scores separately to the user — never a single blended number — and the built slide's location in the target Figma file.
