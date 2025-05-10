import { createApp } from "vue";
import App from "@/App.vue";
import "@/style.css";
import router from "@/router";
import tonConfig from "@/config/ton";
import configureAxiosRetry from "@/config/axios";
import { createVueton } from "@d0rich/vueton";
import { createPinia } from "pinia";
import useUserStore from "./stores/authStore";

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

router.beforeEach(async (to, from, next) => {
  const walletAddress = sessionStorage.getItem("walletAddress");
  const userStore = useUserStore();

  if (walletAddress) {
    await userStore.authentication(walletAddress);
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return next("/error/401");
  }

  next();
});

app.mount("#app");
