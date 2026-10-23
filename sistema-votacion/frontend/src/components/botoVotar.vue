<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  votos: { type: Array, required: true },
});

const emit = defineEmits(["votar"]);

// Paleta de colores: cada opción coge uno (se repite si hay más opciones)
const colores = [
  "rgba(75, 192, 192, 1)", // verde azulado
  "rgba(255, 99, 132, 1)", // rojo
  "rgba(54, 162, 235, 1)", // azul
  "rgba(255, 206, 86, 1)", // naranja
];
</script>

<template>
  <div class="barra-votos">
    <button
      v-for="(cantidad, index) in votos"
      :key="index"
      class="opcio"
      :style="{ '--color': colores[index % colores.length] }"
      @click="emit('votar', index)"
    >
      <span class="nom">{{ t("votacion.opcion", { n: index + 1 }) }}</span>
      <span class="vots">{{ cantidad }}</span>
      <span class="accio">{{ t("votacion.votar") }}</span>
    </button>
  </div>
</template>

<style scoped>
.barra-votos {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  background: #f7f7f7;
}

.opcio {
  flex: 1;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--color);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: inherit;
  cursor: pointer;
  user-select: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  transition:
    filter 0.15s,
    transform 0.1s,
    box-shadow 0.1s;
}

.opcio:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2);
}

.opcio:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}

.opcio:focus-visible {
  outline: 3px solid var(--color);
  outline-offset: 3px;
}

.nom {
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.vots {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.accio {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.85;
}

/* En pantallas muy estrechas, los botones bajan un poco de altura */
@media (max-width: 480px) {
  .barra-votos {
    gap: 8px;
    padding: 8px;
  }
  .opcio {
    min-height: 110px;
  }
  .vots {
    font-size: 2rem;
  }
}
</style>
