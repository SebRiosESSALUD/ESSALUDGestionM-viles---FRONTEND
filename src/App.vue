<template>
  <!-- La aplicación se renderiza aquí mediante router-view -->
  <router-view />
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
let inactivityTimer = null;

// Función de logout: elimina el token y actualiza una clave de sincronización
const logout = () => {
  // Elimina el token
  localStorage.removeItem("token");
  // Actualiza una clave para indicar que se realizó un logout (se usará en el listener de storage)
  localStorage.setItem("logout", Date.now());
  // Redirige al login
  router.push("/login");
};

// Función llamada al expirar el tiempo de inactividad (10 minutos)
const logoutAfterInactivity = () => {
  console.log("Cerrando sesión por inactividad...");
  logout();
};

// Reinicia el timer de inactividad
const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  // 10 minutos = 10 * 60 * 1000 ms
  inactivityTimer = setTimeout(logoutAfterInactivity, 10 * 60 * 1000);
};

// Se invoca en cualquier actividad del usuario (movimiento, clic, scroll, tecla)
const userActivityHandler = () => {
  resetInactivityTimer();
};

onMounted(() => {
  // Inicia el timer de inactividad
  resetInactivityTimer();

  // Registra los eventos de actividad
  window.addEventListener("mousemove", userActivityHandler);
  window.addEventListener("mousedown", userActivityHandler);
  window.addEventListener("click", userActivityHandler);
  window.addEventListener("scroll", userActivityHandler);
  window.addEventListener("keypress", userActivityHandler);

  // Listener para sincronización entre pestañas
  window.addEventListener("storage", (event) => {
    if (event.key === "logout") {
      console.log("Logout detectado en otra pestaña, cerrando sesión en este tab...");
      router.push("/login");
    }
    // Si la clave "token" cambia (por ejemplo, al iniciar sesión con otra cuenta en otra pestaña),
    // se fuerza el logout en todas las pestañas.
    if (event.key === "token") {
      console.log("Cambio detectado en token, cerrando sesión en esta pestaña...");
      router.push("/login");
    }
  });
});

onBeforeUnmount(() => {
  // Se remueven los listeners para evitar fugas de memoria
  window.removeEventListener("mousemove", userActivityHandler);
  window.removeEventListener("mousedown", userActivityHandler);
  window.removeEventListener("click", userActivityHandler);
  window.removeEventListener("scroll", userActivityHandler);
  window.removeEventListener("keypress", userActivityHandler);
});
</script>


<style>
body {
  background-color: #f8f9fa;
  font-family: Arial, sans-serif;
}
</style>
