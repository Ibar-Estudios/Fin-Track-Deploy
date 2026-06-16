import axios from "axios";

const API_URL = 'http://localhost:5000/auth';
/**
 * Envía credenciales al backend y recibe token + datos del usuario
 * @param {Object} credentials - { email, password }
 * @returns {Object} - { token, user } o { statusCode, message }
 */
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

/**
 * Verifica si el token actual es válido y la sesión está activa
 * @param {string} token - JWT del usuario
 * @returns {Object} - { email, message } o error
 */
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
