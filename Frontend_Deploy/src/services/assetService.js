const _API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import axios from "axios";

// Instancia directa de Axios
const APIURL = axios.create({
  baseURL: _API, // asegurate que coincida con tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Servicios de assets
export const getAssets = (userId) => APIURL.get(`/assets/user/${userId}`);
export const createAsset = (userId, data) => APIURL.post(`/assets/user/${userId}`, data);
export const editAssetById = (assetId, data) => APIURL.put(`/assets/${assetId}`, data);
export const deleteAssetById = (assetId) => APIURL.delete(`/assets/${assetId}`);
