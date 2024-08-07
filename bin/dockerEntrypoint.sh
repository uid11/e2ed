#!/usr/bin/env bash
set -eo pipefail
set +u

restoreE2edPackage() {
    if [[ -d "./node_modules/_e2ed" ]]
    then
        echo "Restore temporarily hiding locally installed e2ed package:"
        mv --verbose ./node_modules/_e2ed ./node_modules/e2ed
    fi
}

onExit() {
    if [[ $PID ]] && ps -p $PID > /dev/null
    then
        echo "PID $PID is running"
        kill -USR1 $PID

        echo "dockerEntrypoint will sleep for ${E2ED_TIMEOUT_FOR_GRACEFUL_SHUTDOWN_IN_SECONDS:-16} seconds"
        sleep "${E2ED_TIMEOUT_FOR_GRACEFUL_SHUTDOWN_IN_SECONDS:-16}"
    fi

    restoreE2edPackage;

    echo "Exit from docker entrypoint"
    exit
}

trap "onExit" EXIT

#if [[ -d "./node_modules/e2ed" ]]
#then
#    echo "Temporarily hide locally installed e2ed package:"
#    mv --verbose ./node_modules/e2ed ./node_modules/_e2ed
#fi

if [[ -z $E2ED_DEBUG ]]
then
    /node_modules/e2ed/bin/runE2edInDockerEnvironment.js & PID=$!
else
    node --inspect-brk=0.0.0.0:$E2ED_DEBUG /node_modules/e2ed/bin/runE2edInDockerEnvironment.js & PID=$!
fi

wait $PID
