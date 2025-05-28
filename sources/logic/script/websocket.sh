#!/usr/bin/env bash

cd "$(dirname "$0")"

if [ "$#" -ne 2 ]; then
	echo "Two argument required: gameId, playerId"
	exit
fi

port=3000
gameId=${1}
playerId=${2}

npx wscat -c "ws://localhost:${port}/ws/${gameId}/${playerId}"
