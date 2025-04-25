<template>
  <Toaster />
  <Preloader v-model:loading="loading" />
  <RouterView />
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { RouterView } from "vue-router";
import { useTonConnect } from "@d0rich/vueton";
import { watch } from "vue";
import axios, { AxiosError } from "axios";
import { toast } from "vue-sonner";
import useUserStore from "./stores/userStore";
import Cookies from "js-cookie";
import Preloader from "./components/Preloader.vue";
import { ref } from "vue";

const { tonNetwork, tonWallet, tonConnect } = useTonConnect();
const user = useUserStore();
const loading = ref(true);

const showErrorToast = (message: string) => {
  toast.error("Error", {
    description: message,
    position: "top-right",
    style: {
      backgroundColor: "#fef2f2",
      color: "#991b1b",
    },
  });
};

const waitForAccessToken = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const maxWaitTime = 10000;
    let elapsed = 0;

    const checkToken = setInterval(() => {
      const accessToken = Cookies.get();

      if (accessToken) {
        clearInterval(checkToken);
        resolve();
      }

      elapsed += 2000;
      if (elapsed >= maxWaitTime) {
        clearInterval(checkToken);
        console.error("Timeout: accessToken not found");
        reject(new Error("Timeout: accessToken not found"));
      }
    }, 2000);
  });
};

const authenticateWithTonProof = async () => {
  if (
    tonWallet.value?.connectItems?.tonProof &&
    tonNetwork.value === "testnet"
  ) {
    const tonProof = tonWallet.value.connectItems.tonProof as {
      name: string;
      proof: any;
    };

    tonProof.proof = {
      ...tonProof.proof,
      state_init: tonConnect.account?.walletStateInit,
    };

    try {
      await axios.post(
        "http://localhost:3000/api/auth",
        {
          address: tonWallet.value.account.address,
          network: tonNetwork.value,
          proof: tonProof.proof,
        },
        {
          withCredentials: true,
        }
      );
    } catch (err: any) {
      if (err instanceof AxiosError) {
        showErrorToast(err.response?.data.message || err.message);
      }
    }
  }
};

const fetchUserData = async () => {
  if (tonWallet.value?.account.address) {
    try {
      await waitForAccessToken();

      const res = await axios.get(
        `http://localhost:3000/api/user/wallet/${tonConnect.account?.address}`,
        { withCredentials: true }
      );
      const { data } = res.data;
      user.setUser(data);
    } catch (err: any) {
      await tonConnect.disconnect();
      if (err.response?.data.message == "access token not found") {
        return;
      }

      showErrorToast(err.response?.data.message);
    }
  }
};

watch(() => tonWallet.value?.connectItems?.tonProof, authenticateWithTonProof);

watch(() => tonWallet.value?.account.address, fetchUserData);
</script>
