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
    meta: { requiresAuth: true, role: 1 } // Solo para administradores
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

// Navigation guard para proteger las rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    return next({ path: "/login" });
  }
  next();
});

export default router;
