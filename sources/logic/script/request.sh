#!/usr/bin/env bash
port_default=3000
port="${1:-${port_default}}"
curl -v "http://localhost:${port}"
