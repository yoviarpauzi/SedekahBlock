<template>
  <Toaster />
  <RouterView />
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { RouterView } from "vue-router";
import { useTonConnect } from "@d0rich/vueton";
import { watch } from "vue";
import axios, { AxiosError } from "axios";
import { toast } from "vue-sonner";
import useAuthStore from "./stores/authStore";
import { serverURI } from "./utils/environment";

const { tonNetwork, tonWallet, tonConnect } = useTonConnect();
const user = useAuthStore();

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
        `${serverURI}/api/auth`,
        {
          address: tonWallet.value.account.address,
          network: tonNetwork.value,
          proof: tonProof.proof,
        },
        {
          withCredentials: true,
        }
      );

      await fetchUserData(tonWallet.value?.account.address!);
    } catch (err: any) {
      if (err instanceof AxiosError) {
        showErrorToast(err.response?.data.message || err.message);
      }
    }
  }
};

const fetchUserData = async (address: string) => {
  if (tonWallet.value?.account.address) {
    try {
      await user.authentication(address);
    } catch (err: any) {
      await tonConnect.disconnect();
      if (err instanceof AxiosError) {
        if (err.response?.data.message == "access token not found") {
          return;
        }
        showErrorToast(err.response?.data.message);
      }
    }
  }
};

watch(() => tonWallet.value?.connectItems?.tonProof, authenticateWithTonProof);

watch(
  () => tonNetwork.value,
  async () => {
    if (
      !tonWallet.value?.connectItems?.tonProof &&
      tonNetwork.value == "testnet"
    ) {
      await fetchUserData(tonWallet.value?.account.address!);
    }
  }
);
</script>
