import { isConnected } from "@stellar/freighter-api";
import { getAddress } from "@stellar/freighter-api";

export async function connectWallet(): Promise<string> {
  try {
    const connected = await isConnected();
    if (!connected) throw new Error("Freighter no está conectado");
    const { address, error } = await getAddress();
    if (error) throw new Error("Error al obtener la dirección: " + error);
    return address;
  } catch (err: any) {
    throw new Error("No se pudo conectar la wallet: " + (err?.message || err));
  }
}