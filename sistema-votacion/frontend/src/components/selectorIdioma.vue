<script setup>
import { useI18n } from "vue-i18n";
import { IDIOMAS, cambiarIdioma } from "@/i18n";

const { t, locale } = useI18n();
</script>

<template>
  <label class="selector-idioma">
    <span class="sr-only">{{ t("idioma") }}</span>
    <select :value="locale" @change="cambiarIdioma($event.target.value)">
      <option v-for="(nombre, codigo) in IDIOMAS" :key="codigo" :value="codigo">
        {{ nombre }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.selector-idioma select {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  font: inherit;
  cursor: pointer;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>
