import { createApp } from "vue";
import App from "@/App.vue";
import "@/style.css";
import router from "@/router";
import tonConfig from "@/config/ton";
import configureAxiosRetry from "@/config/axios";
import { createVueton } from "@d0rich/vueton";
import { createPinia } from "pinia";

configureAxiosRetry();

const app = createApp(App);

const vueton = createVueton({
  tonClient: tonConfig.client,
  tonConnectUI: tonConfig.connectUI,
});

const pinia = createPinia();

app.use(vueton);
app.use(router);
app.use(pinia);

app.mount("#app");
