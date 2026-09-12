#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repository_root=$(CDPATH= cd -- "$script_dir/.." && pwd)
version=$(node -p "require('$repository_root/manifest.json').version")
distribution_dir="$repository_root/dist"
temporary_dir=$(mktemp -d "${TMPDIR:-/tmp}/chatgpt-prompt-link-release.XXXXXX")
archive_name="chatgpt-prompt-link-generator-$version.zip"
temporary_archive="$temporary_dir/$archive_name"
release_archive="$distribution_dir/$archive_name"

cleanup() {
  rm -rf "$temporary_dir"
}
trap cleanup EXIT HUP INT TERM

node --check "$repository_root/background.js"
node --check "$repository_root/link-generator.js"
node --check "$repository_root/offscreen.js"
node --check "$repository_root/options.js"
node --test "$repository_root/tests/link-generator.test.js"

mkdir -p "$distribution_dir"

(
  cd "$repository_root"
  zip -X -q "$temporary_archive" \
    manifest.json \
    background.js \
    link-generator.js \
    offscreen.html \
    offscreen.js \
    options.html \
    options.js \
    icons/icon16.png \
    icons/icon48.png \
    icons/icon128.png
)

mv -f "$temporary_archive" "$release_archive"

echo "Created $release_archive"
shasum -a 256 "$release_archive"
