<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "../stores/app";

const store = useAppStore();
const { t } = useI18n();

const usuario = ref("");
const password = ref("");
const error = ref(false);

function login() {
  const valido =
    (usuario.value === "user" || usuario.value === "admin") &&
    password.value === "123";

  error.value = !valido;
  if (valido) {
    store.setLoginInfo({
      loggedIn: true,
      username: usuario.value,
    });
  }
}
</script>

<template>
  <div class="login">
    <h3 class="title">{{ t("login.titulo") }}</h3>
    <form class="form" @submit.prevent="login">
      <label class="form-label" for="usuario">{{ t("login.usuario") }}:</label>
      <input
        class="form-input"
        type="text"
        id="usuario"
        v-model="usuario"
        required
        :placeholder="t('login.usuario')"
      />
      <br /><br />
      <label class="form-label" for="password">{{ t("login.password") }}:</label>
      <input
        class="form-input"
        type="password"
        id="password"
        v-model="password"
        required
        :placeholder="t('login.password')"
      />
      <input class="form-submit" type="submit" :value="t('login.entrar')" />

      <p v-if="error" class="error">{{ t("login.error") }}</p>
    </form>
  </div>
</template>
