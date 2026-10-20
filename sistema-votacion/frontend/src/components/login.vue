<script setup>
import { ref } from "vue";
import { useAppStore } from "../stores/app";

const store = useAppStore();

const usuario = ref("");
const password = ref("");
const mensaje = ref("");

function login() {
  const valido =
    (usuario.value === "user" || usuario.value === "admin") &&
    password.value === "123";

  if (valido) {
    mensaje.value = "";
    store.setLoginInfo({
      loggedIn: true,
      username: usuario.value,
    });
  } else {
    mensaje.value = "Usuario o contraseña incorrectos.";
  }
}
</script>

<template>
  <div class="login">
    <h3 class="title">Introduce tus datos</h3>
    <form class="form" @submit.prevent="login">
      <label class="form-label" for="usuario">Usuario:</label>
      <input
        class="form-input"
        type="text"
        id="usuario"
        v-model="usuario"
        required
        placeholder="Usuario"
      />
      <br /><br />
      <label class="form-label" for="password">Password:</label>
      <input
        class="form-input"
        type="password"
        id="password"
        v-model="password"
        required
        placeholder="Password"
      />
      <input class="form-submit" type="submit" value="Login" />

      <p v-if="mensaje" class="error">{{ mensaje }}</p>
    </form>
  </div>
</template>
