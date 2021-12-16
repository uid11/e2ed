#!/usr/bin/env sh

DIR="${WORKDIR:-$PWD}"
DOCKER_IMAGE="${E2ED_DOCKER_IMAGE:-e2ed}"

docker run --rm -p 9229:9229 \
       -v $DIR:$DIR -w $DIR \
       -e NODE_PATH=/usr/lib/node_modules \
       -e E2ED_ORIGIN=$E2ED_ORIGIN \
       -e E2ED_API_ORIGIN=$E2ED_API_ORIGIN \
       -e E2ED_CONCURRENCY=$E2ED_CONCURRENCY \
       -e E2ED_DEBUG=$E2ED_DEBUG \
       -e E2ED_DOCKER_IMAGE=$E2ED_DOCKER_IMAGE \
       -e E2ED_DOCKER_RETRIES=$E2ED_DOCKER_RETRIES \
       -e E2ED_HIDE_LOGS=$E2ED_HIDE_LOGS \
       -e E2ED_NAVIGATE_STABILIZATION_INTERVAL=$E2ED_NAVIGATE_STABILIZATION_INTERVAL \
       $DOCKER_IMAGE
