import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  // State
  const loginInfo = ref({
    loggedIn: false,
    username: "",
    image: "",
  });
  const votos = ref([0, 0, 0, 0]); // Un array per a 4 opcions (el servidor envia els reals en connectar)

  // Getters
  const isLoggedIn = computed(() => loginInfo.value.loggedIn);

  // Actions
  function setLoginInfo({ loggedIn, username, image }) {
    loginInfo.value = { loggedIn, username, image };
  }

  function setVotos(nousVots) {
    votos.value = nousVots;
  }

  function registrarVoto(index) {
    votos.value[index]++;
  }

  return {
    loginInfo,
    votos,
    isLoggedIn,
    setLoginInfo,
    setVotos,
    registrarVoto,
  };
});
