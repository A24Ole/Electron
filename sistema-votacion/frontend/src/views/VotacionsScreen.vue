<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import botoVotar from "@/components/botoVotar.vue";
import chartCanva from "@/components/chartCanva.vue";
import botoReset from "@/components/botoReset.vue";
import { useAppStore } from "@/stores/app";
import { conectar, votar, desconectar } from "@/services/communicationManager";

const store = useAppStore();
const router = useRouter();
const { t } = useI18n();

onMounted(conectar);
onUnmounted(desconectar);

function manejarVoto(index) {
  store.registrarVoto(index); // guarda en Pinia
  votar(index); // lo envía al servidor
}

function salir() {
  store.setLoginInfo({ loggedIn: false, username: "" });
  router.push("/");
}
</script>

<template>
  <div class="sesion">
    <span>{{ store.loginInfo.username }}</span>
    <botoReset v-if="store.isAdmin" />
    <button class="salir" @click="salir">{{ t("votacion.salir") }}</button>
  </div>
  <botoVotar :votos="store.votos" @votar="manejarVoto" />
  <chartCanva />
</template>

<style scoped>
.sesion {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 0 12px 8px;
}

.salir {
  padding: 4px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  font: inherit;
  cursor: pointer;
}
</style>
