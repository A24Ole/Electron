<script setup>
import { useI18n } from "vue-i18n";
import { reiniciarVotos } from "@/services/communicationManager";

const { t } = useI18n();

function reset() {
  if (confirm(t("votacion.confirmarReset"))) reiniciarVotos();
}
</script>

<template>
  <button class="reset" @click="reset">{{ t("votacion.reset") }}</button>
</template>

<style scoped>
.reset {
  padding: 4px 10px;
  border: 1px solid #c0392b;
  border-radius: 6px;
  background: #fff;
  color: #c0392b;
  font: inherit;
  cursor: pointer;
}

.reset:hover {
  background: #c0392b;
  color: #fff;
}
</style>
