<template>
  <AuthLayout>
    <b-form @submit.prevent="handleLogin">
      <b-form-group label="Correo Electrónico">
        <b-form-input v-model="email" type="email" required></b-form-input>
      </b-form-group>

      <b-form-group label="Contraseña">
        <b-form-input v-model="password" type="password" required></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary" block :disabled="loading">
        <span v-if="loading">Cargando...</span>
        <span v-else>Iniciar Sesión</span>
      </b-button>

      <p v-if="error" class="text-danger mt-2">{{ error }}</p>
    </b-form>
  </AuthLayout>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../services/authService.js";
import AuthLayout from "../layouts/AuthLayout.vue";

export default {
  name: "Login",
  components: { AuthLayout },
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const loading = ref(false);
    const router = useRouter();

    const handleLogin = async () => {
      try {
        loading.value = true;
        error.value = "";

        // 1. Realizar login y guardar token
        const response = await authService.login(email.value, password.value);
        const token = response.data.access_token;
        localStorage.setItem("token", token);
        
        // 2. Obtener datos del usuario
        const userResponse = await authService.getCurrentUser();
        const user = userResponse.data;
        
        // 3. Redirigir según el rol
        if (user.rol?.id_rol === 1) {
          router.push("/dashboard");
        } else {
          router.push("/user-view");
        }
      } catch (err) {
        error.value = err.response?.data?.detail || "Error al iniciar sesión";
      } finally {
        loading.value = false;
      }
    };

    return { email, password, error, loading, handleLogin };
  }
};
</script>
