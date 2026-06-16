const _API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import axios from "axios";

const API_URL = _API + "/user"; // entorno del backend

export const getUserByUsername = async (username) =>
  axios.get(`${API_URL}/${username}`);

export const createUser = async (userData) =>
  axios.post(`${API_URL}/register`, userData);

export const editUser = async (username, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${username}`, updates);
    console.log("URL final:", `${API_URL}/${username}`);
    console.log("Username enviado:", username, updates);
    return response.data;
  } catch (error) {
    console.error("Error al editar usuario:", error);
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "Error al editar usuario",
    };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "Error al eliminar cuenta",
    };
  }
};


export const evaluateProfile = async (perfil, email) => {
  try {
    const response = await axios.post(`${API_URL}/evaluate-profile`, {
      perfil,
      email,
    });
    return response.data; // devolvemos solo el payload útil
  } catch (error) {
    console.error("Error en evaluateProfile:", error);
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "Error al evaluar perfil",
    };
  }
};
