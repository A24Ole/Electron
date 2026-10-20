<script setup>
import { onMounted, onUnmounted } from "vue";
import botoVotar from "@/components/botoVotar.vue";
import { useAppStore } from "@/stores/app";
import { conectar, votar, desconectar } from "@/services/communicationManager";

const store = useAppStore();

onMounted(conectar);
onUnmounted(desconectar);

function manejarVoto(index) {
  store.registrarVoto(index); // guarda en Pinia
  votar(index); // lo envía al servidor
}
</script>

<template>
  <botoVotar :votos="store.votos" @votar="manejarVoto" />
</template>
