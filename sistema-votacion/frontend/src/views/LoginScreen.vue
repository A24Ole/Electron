<script setup>
import { useRouter } from "vue-router";
import Login from "../components/login.vue";

const router = useRouter();

function handleLoginOk() {
  router.push("/votacions");
}
</script>

<template>
  <Login @login-ok="handleLoginOk" />
</template>

<style scoped></style>
