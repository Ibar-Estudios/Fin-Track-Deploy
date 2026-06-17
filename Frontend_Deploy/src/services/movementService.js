import axios from "axios";

const _API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const APIURL = axios.create({
  baseURL: _API,
  headers: { "Content-Type": "application/json" },
});

export const getMovementsByAsset = (assetId) => APIURL.get(`/movements/${assetId}`);
export const registerMovement = (data) => APIURL.post("/movements", data);