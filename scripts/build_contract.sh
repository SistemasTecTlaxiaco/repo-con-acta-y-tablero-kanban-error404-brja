#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../contracts/logintech-contract"
echo "Compilando contrato (release)..."
cargo build --release --target wasm32-unknown-unknown
WASM_PATH="target/wasm32-unknown-unknown/release/logintech_contract.wasm"
if [ ! -f "$WASM_PATH" ]; then
  echo "WASM no encontrado en $WASM_PATH"
  exit 1
fi
echo "WASM compilado: $WASM_PATH"
