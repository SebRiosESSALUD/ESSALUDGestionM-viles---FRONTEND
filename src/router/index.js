import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import UserView from "../pages/UserView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { 
    path: "/dashboard", 
    component: Dashboard, 
    meta: { requiresAuth: true, roles: [1, 2] } // Acceso para Admin (1) y Gestor (2)
  },
  { 
    path: "/user-view", 
    component: UserView, 
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación para proteger las rutas y aplicar control de roles
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const roleId = parseInt(localStorage.getItem("userRoleId") || "0", 10);

  // Si la ruta requiere autenticación y no hay token, redirigir a login
  if (to.meta.requiresAuth && !token) {
    return next({ path: "/login" });
  }

  // Si la ruta define roles y el usuario no pertenece, redirigir o mostrar mensaje
  if (to.meta.roles && !to.meta.roles.includes(roleId)) {
    // Aquí podrías redirigir a una página de "Sin permiso" o al login
    return next({ path: "/login" });
  }

  next();
});

export default router;
