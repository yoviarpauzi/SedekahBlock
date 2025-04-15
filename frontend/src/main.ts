import { createApp } from "vue";
import App from "@/App.vue";
import "@/style.css";
import router from "@/router";
import tonConfig from "@/config/ton";
import configureAxiosRetry from "@/config/axios";
import { createVueton } from "@d0rich/vueton";

configureAxiosRetry();

const app = createApp(App);

const vueton = createVueton({
  tonClient: tonConfig.client,
  tonConnectUI: tonConfig.connectUI,
});

app.use(vueton);
app.use(router);

app.mount("#app");
