#!/usr/bin/env bash

cd "$(dirname "$0")"

port=3000
gameId=${1}
playerId=${2}

npx wscat -c "ws://localhost:${port}/ws?gameId=${gameId}&playerId=${playerId}"
