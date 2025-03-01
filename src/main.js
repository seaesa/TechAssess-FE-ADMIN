import { createApp } from "vue";
import App from "@/App.vue";
import { createPinia } from "pinia";
// router
import router from "@/router";
// import css
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vue3-toastify/dist/index.css";
import "@/styles/style.css";
import "@/styles/index.css";
import { injectPrimeVue } from './plugins/prime-vue';

const pinia = createPinia();

// bootstrap
const app = createApp(App);

injectPrimeVue(app);
app.use(pinia);
app.use(router);

app.mount('#app');
