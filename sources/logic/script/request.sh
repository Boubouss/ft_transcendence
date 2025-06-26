#!/usr/bin/env bash

cd "$(dirname "$0")"

port_default=3001
port="${1:-${port_default}}"

curl -v "http://localhost:${port}"
