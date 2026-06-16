import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getWalletMethods = (userId) =>
  axios.get(`${API}/wallet/user/${userId}`);

export const addWalletMethod = (userId, data) =>
  axios.post(`${API}/wallet/user/${userId}`, data);

export const depositToMethod = (userId, methodId, amount) =>
  axios.post(`${API}/wallet/user/${userId}/deposit/${methodId}`, { amount });

export const deleteWalletMethod = (userId, methodId) =>
  axios.delete(`${API}/wallet/user/${userId}/${methodId}`);
