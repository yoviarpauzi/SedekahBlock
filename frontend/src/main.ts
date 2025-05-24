import { createApp } from "vue";
import App from "@/App.vue";
import "@/style.css";
import router from "@/router";
import tonConfig from "@/config/ton";
import configureAxiosRetry from "@/config/axios";
import { createVueton } from "@d0rich/vueton";
import { createPinia } from "pinia";
import useUserStore from "./stores/authStore";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Quill } from "@vueup/vue-quill";
import { serverURI } from "./utils/environment";
import { useRoute } from "vue-router";
import axios from "axios";

Quill.debug("error");

configureAxiosRetry();

const app = createApp(App);

const vueton = createVueton({
  tonClient: tonConfig.client,
  tonConnectUI: tonConfig.connectUI,
});

const pinia = createPinia();

app.component("QuillEditor", QuillEditor);
app.use(router);
app.use(vueton);
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

  if (to.meta.requireExistId) {
    const id = Number(to.params.id);

    if (isNaN(id)) {
      return next("/error/404");
    }

    try {
      await axios.get(`${serverURI}/api/campaigns/id/${id}`, {
        withCredentials: true,
      });
    } catch (err) {
      return next("/error/404");
    }
  }

  next();
});

app.mount("#app");
