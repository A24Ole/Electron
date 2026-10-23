import { createRouter, createWebHashHistory } from "vue-router";
import { useAppStore } from "../stores/app";

import loginScreen from "../views/LoginScreen.vue";
import votacionsScreen from "../views/VotacionsScreen.vue";

const routes = [
  { path: "/", component: loginScreen },
  {
    path: "/votacions",
    name: "votacions",
    component: votacionsScreen,
    meta: { requiereLogin: true },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Sin sesión iniciada no se puede entrar a la votación
router.beforeEach((to) => {
  if (to.meta.requiereLogin && !useAppStore().isLoggedIn) return "/";
});
