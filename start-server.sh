#!/usr/bin/env bash
# Servidor local para previsualizar Impact11sci
PORT=${1:-8080}
echo "Sirviendo en http://localhost:$PORT"
python3 -m http.server "$PORT"
