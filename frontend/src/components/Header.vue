<template>
  <header class="fixed w-full py-4 font-poppins" ref="header">
    <div class="container">
      <div class="flex items-center justify-between">
        <!-- Header Left -->
        <div class="flex items-center gap-x-8 lg:gap-x-14">
          <RouterLink to="/">
            <div class="flex items-center gap-x-2 md:gap-x-3">
              <img src="/logo.png" alt="logo" class="w-8" />
              <h1
                class="text-lg font-bold text-green-800 hidden md:inline font-jakarta"
              >
                Sedekah<span class="text-green-600">Block</span>
              </h1>
            </div>
          </RouterLink>

          <nav class="hidden lg:flex lg:items-center">
            <ul class="flex gap-x-10 text-sm text-green-800 font-medium">
              <li
                class="hover:underline"
                :class="[route.path === '/' ? 'underline' : '']"
              >
                <RouterLink to="/">Beranda</RouterLink>
              </li>

              <li
                :class="[
                  'hover:underline',
                  route.path === '/campaign' ? 'undeline' : '',
                ]"
              >
                <RouterLink to="/campaign">Kampanye</RouterLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Header Right -->
        <div class="flex items-center">
          <Button
            variant="success"
            class="flex items-center font-grotesque mr-4 lg:mr-0"
            @click="connectWallet"
            v-if="!tonNetwork"
          >
            <Wallet :size="25" />
            CONNECT
          </Button>

          <div v-else class="mr-4 gap-x-4 flex items-center"></div>

          <Sheet>
            <SheetTrigger as-child class="lg:hidden">
              <Button variant="success">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent class="w-4/5 max-w-xs sm:max-w-sm font-poppins">
              <ul
                class="flex flex-col gap-4 py-8 px-6 text-base text-green-800 font-medium"
              >
                <li>
                  <SheetClose>
                    <RouterLink
                      to="/"
                      class="hover:border-b-2 hover:border-green-600"
                      :class="[
                        route.path === '/' ? 'border-b-2 border-green-600' : '',
                      ]"
                      >Beranda</RouterLink
                    >
                  </SheetClose>
                </li>

                <li>
                  <SheetClose>
                    <RouterLink
                      to="/campaign"
                      class="hover:border-b-2 hover:border-green-600"
                      :class="[
                        route.path === '/campaign'
                          ? 'border-b-2 border-green-600'
                          : '',
                      ]"
                      >Kampanye</RouterLink
                    >
                  </SheetClose>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
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
import { Wallet, Menu, User, History, Power, Bell } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useUserStore from "@/stores/userStore";
import SheetClose from "./ui/sheet/SheetClose.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const route = useRoute();
const header = ref<HTMLElement | null>(null);
const { tonNetwork, tonConnect } = useTonConnect();
const user = useUserStore();

onMounted(async () => {
  window.addEventListener("scroll", () => {
    if (header.value) {
      if (window.scrollY > 0) {
        header.value.classList.add("bg-white", "shadow-sm");
      } else {
        header.value.classList.remove("bg-white", "shadow-sm");
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
