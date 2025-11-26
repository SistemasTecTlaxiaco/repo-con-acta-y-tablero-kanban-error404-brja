#!/usr/bin/env bash
set -e
# Requiere: soroban-cli configurado y autenticado en testnet/local
cd "$(dirname "$0")/../contracts/logintech-contract"
./../../scripts/build_contract.sh

WASM="target/wasm32-unknown-unknown/release/logintech_contract.wasm"
# Ajusta la network: testnet o localnet configurado con soroban-cli
echo "Desplegando contrato..."
soroban contract deploy --wasm "$WASM" --network testnet
# El comando imprime contract id: cópialo para el frontend
