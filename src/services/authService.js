// authService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const authService = {
  async login(email, password) {
    const params = new URLSearchParams({ username: email, password });
    const response = await axios.post(`${API_URL}/usuarios/login`, params);

    // Extrae los datos de la respuesta
    const { access_token, id_rol, nombre_rol } = response.data;

    // Guárdalos en localStorage
    localStorage.setItem("token", access_token);
    localStorage.setItem("userRole", nombre_rol);     // <-- aquí
    localStorage.setItem("userRoleId", id_rol.toString());

    return response;
  },

  async getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token guardado");

    return axios.get(`${API_URL}/usuarios/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userRoleId");
  }
};
