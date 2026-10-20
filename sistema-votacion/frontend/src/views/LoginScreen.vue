<script setup>
import { watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAppStore } from "../stores/app";
import Login from "../components/login.vue";

const router = useRouter();
const { isLoggedIn } = storeToRefs(useAppStore());

watch(isLoggedIn, (logged) => {
  if (logged) router.push("/votacions");
});
</script>

<template>
  <Login />
</template>
