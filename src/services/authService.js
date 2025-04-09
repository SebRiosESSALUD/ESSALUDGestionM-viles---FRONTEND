// authService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const authService = {
  async login(email, password) {
    // Usamos URLSearchParams para enviar los datos en formato x-www-form-urlencoded
    const params = new URLSearchParams({ username: email, password: password });
    return axios.post(`${API_URL}/usuarios/login`, params);
  },

  async getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token guardado");

    return axios.get(`${API_URL}/usuarios/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  logout() {
    localStorage.removeItem("token");
  }
};
