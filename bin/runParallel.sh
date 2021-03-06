#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

commands=("$@")
pids=()

for command in ${commands[*]}; do
    npm run $command & pids+=($!)
done

for pid in ${pids[*]}; do
    if ! wait $pid; then
        exit 1
    fi
done
