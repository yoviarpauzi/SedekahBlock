<template>
  <header class="fixed w-full py-4 font-poppins z-10" ref="header">
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
                :class="{
                  'hover:border-b-2 hover:border-b-green-700': true,
                  'border-b-2 border-b-green-700': route.path === '/',
                }"
              >
                <RouterLink to="/">Beranda</RouterLink>
              </li>

              <li
                :class="{
                  'hover:border-b-2 hover:border-b-green-700': true,
                  'border-b-2 border-b-green-700':
                    route.path.includes('/campaigns'),
                }"
              >
                <RouterLink to="/campaigns">Kampanye</RouterLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Header Right -->
        <div class="flex items-center">
          <Button
            class="flex items-center font-grotesque mr-4 lg:mr-0"
            variant="success"
            @click="connectWallet"
            v-if="!tonNetwork"
          >
            <Wallet :size="25" />
            CONNECT
          </Button>

          <div v-else class="mr-4 lg:mr-0">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Avatar class="w-8 h-8 cursor-pointer">
                  <AvatarImage
                    :src="
                      user.profile_picture
                        ? user.profile_picture.includes('ui-avatars.com')
                          ? user.profile_picture
                          : `${serverURI}/${user.profile_picture}`
                        : 'https://ui-avatars.com/api/?name=ID'
                    "
                    class="w-8 h-8"
                  />
                  <AvatarFallback> ID </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                :side-offset="4"
              >
                <DropdownMenuLabel class="p-0 font-normal">
                  <div
                    class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                  >
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage
                        :src="
                          user.profile_picture
                            ? user.profile_picture.includes('ui-avatars.com')
                              ? user.profile_picture
                              : `${serverURI}/${user.profile_picture}`
                            : 'https://ui-avatars.com/api/?name=ID'
                        "
                        :alt="user.name"
                      />
                      <AvatarFallback class="rounded-lg"> ID </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{
                        user.name
                      }}</span>
                      <span class="truncate text-xs">{{ user.role }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <RouterLink to="/account">
                    <DropdownMenuItem> Account </DropdownMenuItem>
                  </RouterLink>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click.prevent="disconnectWallet">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
                      class="hover:border-b-2 hover:border-green-700"
                      :class="[
                        route.path === '/' ? 'border-b-2 border-green-700' : '',
                      ]"
                      >Beranda</RouterLink
                    >
                  </SheetClose>
                </li>

                <li>
                  <SheetClose>
                    <RouterLink
                      to="/campaigns"
                      class="hover:border-b-2 hover:border-green-700"
                      :class="[
                        route.path === '/campaign'
                          ? 'border-b-2 border-green-700'
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
import { connectWallet } from "@/utils/connectionWallet";
import { useRoute } from "vue-router";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, Wallet } from "lucide-vue-next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserStore from "@/stores/auth-store";
import showToast from "@/utils/showToast";
import { serverURI } from "@/utils/environment";

const route = useRoute();
const header = ref<HTMLElement | null>(null);
const { tonNetwork, tonConnect } = useTonConnect();
const user = useUserStore();

const disconnectWallet = async () => {
  try {
    await tonConnect.disconnect();
    sessionStorage.clear();
  } catch (err) {
    showToast("error", "error", "error disconnect wallet");
  }
};

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
