<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";
import Chart from "chart.js/auto";

const store = useAppStore();
const { t } = useI18n();

const chartCanvas = ref(null);
let chartInstance = null;

// Etiquetas traducidas, una por opción
const etiquetas = computed(() =>
  store.votos.map((_, i) => t("votacion.opcion", { n: i + 1 })),
);

onMounted(() => {
  chartInstance = new Chart(chartCanvas.value.getContext("2d"), {
    type: "bar",
    data: {
      labels: etiquetas.value,
      datasets: [
        {
          label: t("votacion.votos"),
          data: store.votos,
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    },
  });
});

// Se redibuja cuando cambian los votos o el idioma
watch(
  [() => store.votos, etiquetas],
  ([votos, labels]) => {
    if (!chartInstance) return;
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = votos;
    chartInstance.data.datasets[0].label = t("votacion.votos");
    chartInstance.update();
  },
  { deep: true },
);
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 50vh;
  width: 90vw;
  max-width: 800px;
  margin: 20px auto;
}
</style>
