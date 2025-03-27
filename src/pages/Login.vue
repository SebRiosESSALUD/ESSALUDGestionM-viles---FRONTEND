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
        
        const token = await authService.login(email.value, password.value);
        localStorage.setItem("token", token); // Guardar token en localStorage
        
        router.push("/dashboard"); // Redirigir tras login exitoso
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
