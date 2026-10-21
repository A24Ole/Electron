import { createRouter, createWebHashHistory } from "vue-router";

import loginScreen from "../views/LoginScreen.vue";
import votacionsScreen from "../views/VotacionsScreen.vue";

const routes = [
  { path: "/", component: loginScreen },
  { path: "/votacions", name: "votacions", component: votacionsScreen },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
