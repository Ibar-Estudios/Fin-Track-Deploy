const _API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import axios from "axios";

const APIURL = axios.create({
  baseURL: _API, // ajustá según tu entorno
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener historial de movimientos por activo
export const getMovementsByAsset = (assetId) =>
  APIURL.get(`/movements/${assetId}`);

// Registrar nuevo movimiento (compra/venta)
export const registerMovement = (data) =>
  APIURL.post("/movements", data);
