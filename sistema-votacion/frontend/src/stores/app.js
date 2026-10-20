import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // State
  const loginInfo = ref({
    loggedIn: false,
    username: '',
    image: '',
  })
  const votos = ref([1, 23, 0, 0]) // Un array per a 4 opcions

  // Getters (com a computed properties)
  const isLoggedIn = computed(() => loginInfo.value.loggedIn)

  // Actions (com a funcions)
  function setLoginInfo({ loggedIn, username, image }) {
    loginInfo.value = { loggedIn, username, image }
  }

  function setVotos(nousVots) {
    votos.value = nousVots
  }

  return { 
    loginInfo, 
    votos, 
    isLoggedIn, 
    setLoginInfo, 
    setVotos 
  }
})