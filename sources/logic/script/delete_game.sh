#!/usr/bin/env bash

cd "$(dirname "$0")"

config="delete.json"
gameId="${1:-0}"
port=3001

data="$(jq .gameId="${gameId}" "${config}")"
jq <<<"${data}"

curl -v -X DELETE \
	-H "Content-Type: application/json" \
	-d "$data" \
	"http://localhost:${port}/games"
