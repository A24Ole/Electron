import { createI18n } from "vue-i18n";
import es from "./locales/es.json";
import ca from "./locales/ca.json";
import en from "./locales/en.json";

export const IDIOMAS = { es: "Español", ca: "Català", en: "English" };

const CLAVE_GUARDADA = "idioma";

// Idioma inicial: el último elegido, si no el del navegador y, si no, español
function idiomaInicial() {
  let guardado = null;
  try {
    guardado = localStorage.getItem(CLAVE_GUARDADA);
  } catch {
    // localStorage puede no estar disponible (modo privado, etc.)
  }
  const navegador = navigator.language.slice(0, 2);
  return [guardado, navegador].find((codigo) => codigo in IDIOMAS) ?? "es";
}

export const i18n = createI18n({
  legacy: false,
  locale: idiomaInicial(),
  fallbackLocale: "es",
  messages: { es, ca, en },
});

export function cambiarIdioma(codigo) {
  i18n.global.locale.value = codigo;
  document.documentElement.lang = codigo;
  try {
    localStorage.setItem(CLAVE_GUARDADA, codigo);
  } catch {
    // Si no se puede guardar, el idioma solo dura hasta recargar
  }
}

document.documentElement.lang = i18n.global.locale.value;
