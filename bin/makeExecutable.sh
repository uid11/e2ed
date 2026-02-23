#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

files=("$@")

for file in "${files[@]}"; do
    printf '#!/usr/bin/env node\n\n' | cat - "$file" > "$file.tmp" && mv "$file.tmp" "$file" && chmod +x "$file"
done
