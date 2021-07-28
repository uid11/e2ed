#!/usr/bin/env sh

DIR="${WORKDIR:-$PWD}"
DOCKER_IMAGE="${E2ED_DOCKER_IMAGE:-testcafe/testcafe}"

docker run --rm --user 1000 --entrypoint ./bin/withRetries.js -v $DIR:$DIR -w $DIR/node_modules/e2ed -e NODE_PATH=/usr/lib/node_modules -e E2ED_API_ORIGIN=$E2ED_API_ORIGIN -e E2ED_ORIGIN=$E2ED_ORIGIN -e E2ED_DOCKER_CONCURRENCY=$E2ED_DOCKER_CONCURRENCY $DOCKER_IMAGE