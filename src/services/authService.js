import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Reemplázalo con tu URL real

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error en el login";
    }
  },

  logout() {
    localStorage.removeItem("token");
  }
};
