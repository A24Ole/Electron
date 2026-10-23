<script setup>
import { watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import selectorIdioma from "@/components/selectorIdioma.vue";

const { t } = useI18n();

// El título de la pestaña también cambia con el idioma
watchEffect(() => {
  document.title = t("app.title");
});
</script>

<template>
  <header class="cabecera">
    <h1 class="titulo">{{ t("app.title") }}</h1>
    <selectorIdioma />
  </header>
  <router-view />
</template>

<style scoped>
.cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
}

.titulo {
  margin: 0;
  font-size: 1.25rem;
}
</style>
