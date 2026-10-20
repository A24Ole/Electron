<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { useAppStore } from "@/stores/app";

import Chart from "chart.js/auto";

const store = useAppStore();

const chartCanvas = ref(null);

let chartInstance = null;

const chartData = ref({
  labels: ["Opció 1", "Opció 2", "Opció 3", "Opció 4"],

  datasets: [
    {
      label: "Vots",

      data: store.votos,

      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",

        "rgba(255, 99, 132, 0.6)",

        "rgba(54, 162, 235, 0.6)",

        "rgba(255, 206, 86, 0.6)",
      ],
    },
  ],
});

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext("2d");

    chartInstance = new Chart(ctx, {
      type: "bar",

      data: chartData.value,

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          y: {
            beginAtZero: true,

            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }
});

watch(
  () => store.votos,
  (newVotos) => {
    if (chartInstance) {
      chartInstance.data.datasets[0].data = newVotos;

      chartInstance.update();
    }
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
