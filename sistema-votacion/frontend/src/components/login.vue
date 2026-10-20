<script setup>
import { ref } from "vue";

const emit = defineEmits(["login-ok"]);

const usuario = ref("");
const password = ref("");
const mensaje = ref("");

function login() {
  if (usuario.value === "user" && password.value === "123") {
    emit("login-ok");
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
