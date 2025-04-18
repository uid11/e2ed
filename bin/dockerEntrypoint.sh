#!/usr/bin/env bash
set -eo pipefail
set +u

onExit() {
    if [[ $PID ]] && ps -p $PID > /dev/null
    then
        echo "PID $PID is running"
        kill -USR1 $PID

        echo "dockerEntrypoint will sleep for ${E2ED_TIMEOUT_FOR_GRACEFUL_SHUTDOWN_IN_SECONDS:-16} seconds"
        sleep "${E2ED_TIMEOUT_FOR_GRACEFUL_SHUTDOWN_IN_SECONDS:-16}"
    fi

    echo "Exit from docker entrypoint"
    exit
}

trap "onExit" EXIT

DEBUG_PORT=$([[ $E2ED_DEBUG == inspect-brk:* ]] && echo "${E2ED_DEBUG#inspect-brk:}" || echo "")

if [[ -z $DEBUG_PORT ]]
then
    /node_modules/e2ed/bin/runE2edInDockerEnvironment.js & PID=$!
else
    node --inspect-brk=0.0.0.0:$DEBUG_PORT /node_modules/e2ed/bin/runE2edInDockerEnvironment.js & PID=$!
fi

wait $PID
