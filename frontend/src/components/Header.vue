<template>
  <header class="fixed w-full py-4" ref="header">
    <div class="container">
      <div class="flex items-center justify-between">
        <RouterLink to="/">
          <div class="flex items-center gap-x-2 md:gap-x-3">
            <img src="/logo.png" alt="logo" class="w-8" />
            <h1 class="text-lg font-bold text-green-800 hidden md:inline">
              Sedekah<span class="text-green-600">Block</span>
            </h1>
          </div>
        </RouterLink>

        <div class="flex items-center gap-x-2">
          <div v-if="!tonNetwork">
            <Button variant="success" @click="connectWallet">Connect</Button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { RouterLink } from "vue-router";
import { toast } from "vue-sonner";
import { useTonConnect } from "@d0rich/vueton";
import connectWallet from "@/utils/connectWallet";

const header = ref<HTMLElement | null>(null);
const { tonNetwork, tonConnect } = useTonConnect();

onMounted(async () => {
  window.addEventListener("scroll", () => {
    if (header.value) {
      if (window.scrollY > 0) {
        header.value.classList.add("bg-white", "shadow-md");
      } else {
        header.value.classList.remove("bg-white", "shadow-md");
      }
    }
  });
});

onUnmounted(async () => {
  window.removeEventListener("scroll", () => {});
});

watch(
  () => tonNetwork.value,
  (newNetwork) => {
    if (newNetwork === "mainnet") {
      tonConnect.disconnect();
      toast.error("Error", {
        description: "Tolong koneksikan dengan testnet wallet!",
        position: "top-right",
        style: {
          backgroundColor: "#fef2f2",
          color: "#991b1b",
        },
        actionButtonStyle: {
          backgroundColor: "#991b1b",
          color: "white",
          borderRadius: "4px",
          padding: "4px 8px",
        },
        action: {
          label: "Retry",
          onClick: async () => {
            await connectWallet();
          },
        },
      });
    }
  },
  { immediate: true }
);
</script>
