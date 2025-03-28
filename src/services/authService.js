import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Asegúrate de que sea la URL correcta

export const authService = {
  async login(email, password) {
    try {
      // FastAPI espera application/x-www-form-urlencoded, por eso usamos URLSearchParams
      const formData = new URLSearchParams();
      formData.append("username", email);  // FastAPI usa "username", no "email"
      formData.append("password", password);

      const response = await axios.post(`${API_URL}/usuarios/login`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Error en el login";
    }
  },

  logout() {
    localStorage.removeItem("token");
  }
};
