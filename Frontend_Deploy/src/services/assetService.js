import axios from "axios";

const _API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const APIURL = axios.create({
  baseURL: _API,
  headers: { "Content-Type": "application/json" },
});

export const getAssets = (userId) => APIURL.get(`/assets/user/${userId}`);
export const createAsset = (userId, data) => APIURL.post(`/assets/user/${userId}`, data);
export const editAssetById = (assetId, data) => APIURL.put(`/assets/${assetId}`, data);
export const deleteAssetById = (assetId) => APIURL.delete(`/assets/${assetId}`);