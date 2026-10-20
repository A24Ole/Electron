<script setup>
defineProps({
  votos: { type: Array, required: true },
});

const emit = defineEmits(["votar"]);
</script>

<template>
  <div v-for="(cantidad, index) in votos" :key="index">
    Opció {{ index + 1 }}: {{ cantidad }}
    <button @click="emit('votar', index)">Votar</button>
  </div>
</template>
