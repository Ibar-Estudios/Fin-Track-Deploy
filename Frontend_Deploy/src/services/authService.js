import axios from "axios";

const _API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = _API + "/auth";

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "Error al iniciar sesión",
    };
  }
};

export const checkSession = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/session`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return {
      statusCode: error.response?.status || 401,
      message: "Sesión inválida o expirada",
    };
  }
};