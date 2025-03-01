import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

/*** @type {import('vue').App}*/
export const injectPrimeVue = (app) => {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: "light",
      },
    },
  })
}