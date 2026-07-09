#!/usr/bin/env bash
set -euo pipefail

# Publish script for @opendash-ai/cli
# Usage: ./publish.sh <version>
#
# Prerequisites:
#   - npm login (for npm publish)
#   - gh auth login (for GitHub releases)
#   - Build completed with: bun run script/build.ts

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 0.1.0"
  exit 1
fi

# Strip leading 'v' if present
VERSION="${VERSION#v}"

DIST_DIR="../opendash/dist"
NPM_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Publishing OpenDash v${VERSION}..."

# 1. Create GitHub release and upload archives
echo ""
echo "=== Creating GitHub release ==="
gh release create "v${VERSION}" \
  --title "v${VERSION}" \
  --notes "Release v${VERSION}" \
  "${DIST_DIR}"/*.zip \
  "${DIST_DIR}"/*.tar.gz \
  --clobber

echo ""
echo "=== GitHub release created ==="

# 2. Update version in package.json files
echo ""
echo "=== Updating versions ==="

# Update wrapper package version
cd "$NPM_DIR"
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"${VERSION}\"/" package.json

# Update platform package versions
for pkg_dir in "${DIST_DIR}"/opendash-*/; do
  if [ -f "${pkg_dir}/package.json" ]; then
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"${VERSION}\"/" "${pkg_dir}/package.json"
  fi
done

# Update optionalDependencies version in wrapper
sed -i "s/@opendash-ai\/opendash-[^\"]*\": \"[^\"]*\"/@opendash-ai\/opendash-/g" package.json
for pkg_dir in "${DIST_DIR}"/opendash-*/; do
  pkg_name=$(grep '"name"' "${pkg_dir}/package.json" | head -1 | sed 's/.*": "//;s/".*//')
  sed -i "s|${pkg_name}\": \"[^\"]*\"|${pkg_name}\": \"${VERSION}\"|" package.json
done

# 3. Publish platform packages to npm
echo ""
echo "=== Publishing platform packages to npm ==="
for pkg_dir in "${DIST_DIR}"/opendash-*/; do
  if [ -f "${pkg_dir}/package.json" ]; then
    pkg_name=$(grep '"name"' "${pkg_dir}/package.json" | head -1 | sed 's/.*": "//;s/".*//')
    echo "Publishing ${pkg_name}@${VERSION}..."
    npm publish "${pkg_dir}" --access public 2>&1 || true
  fi
done

# 4. Publish wrapper package to npm
echo ""
echo "=== Publishing wrapper package ==="
npm publish --access public

echo ""
echo "=== Done! ==="
echo "Users can now install with:"
echo "  npm install -g @opendash-ai/cli@${VERSION}"
echo ""
echo "Or using the install script:"
echo "  curl -fsSL https://opendashai.netlify.app/install | bash"
