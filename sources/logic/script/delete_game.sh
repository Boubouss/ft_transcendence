#!/usr/bin/env bash

cd "$(dirname "$0")"

config="delete.json"
gameId="${1:-100}"
port=3000

data="$(jq .gameId="${gameId}" "${config}")"
jq <<<"${data}"

curl -v -X DELETE \
	-H "Content-Type: application/json" \
	-d "$data" \
	"http://localhost:${port}/games"
