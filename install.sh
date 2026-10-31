#!/usr/bin/env bash
# Alto OS — instala skills, agentes, comandos y workflow en ~/.claude
# Uso: bash install.sh   (desde la raiz del repo)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
DEST="${CLAUDE_HOME:-$HOME/.claude}"
SK="$DEST/skills"

mkdir -p "$SK/alto-house" "$DEST/agents" "$DEST/commands" "$DEST/workflows"

# Metodologia: vive anidada en alto-house/ y se registra como ah-<nombre>
# (Claude Code solo ve ~/.claude/skills/<nombre>/SKILL.md, un nivel).
cp -R "$HERE/skills/alto-house/." "$SK/alto-house/"
for dir in "$SK/alto-house"/*/; do
  [ -f "$dir/SKILL.md" ] || continue
  name="$(basename "$dir")"
  ln -sfn "alto-house/$name" "$SK/ah-$name"
  echo "  skill  ah-$name"
done

# Produccion
for dir in "$HERE"/skills/*/; do
  name="$(basename "$dir")"
  [ "$name" = "alto-house" ] && continue
  rm -rf "$SK/$name" && cp -R "$dir" "$SK/$name"
  echo "  skill  $name"
done

cp "$HERE"/agents/*.md "$DEST/agents/";     echo "  $(ls "$HERE"/agents | wc -l | tr -d ' ') agentes"
cp "$HERE"/commands/*.md "$DEST/commands/"; echo "  comandos: /ah /pitch-template-library /pitch-slide-from-image"
cp "$HERE"/workflows/*.js "$DEST/workflows/"; echo "  workflow brand-to-website"

# Dependencias de terceros: avisar, no instalar
echo
for name in market-research deep-research research-ops council strategic-compact brand-voice content-engine; do
  [ -e "$SK/$name" ] || [ -e "$SK/ecc/$name" ] || echo "  falta $name (Everything Claude Code)"
done
[ -e "$SK/ah-seo-geo" ] || [ -e "$SK/seo-geo" ] || echo "  opcional: github.com/frontdesk-alhouse/seo-geo-skill"
[ -e "$SK/clone-to-webflow" ] || echo "  opcional: github.com/frontdesk-alhouse/clone-to-webflow-skill (clone-to-framer usa su motor)"

echo
echo "Listo. En Claude Code:  /ah [cliente] — [lo que quieres lograr]"
