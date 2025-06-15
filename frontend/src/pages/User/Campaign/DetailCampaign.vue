<template>
  <div class="container pt-20">
    <div class="grid lg:grid-cols-3 lg:gap-x-4">
      <!-- left -->
      <div class="lg:col-span-1">
        <CampaignProfileCard :campaign="campaignStore.currentCampaign" />
      </div>

      <!-- right -->
      <div class="lg:col-span-2">
        <div
          class="p-4 bg-white shadow-sm border rounded-md campaign_story relative"
          :class="{
            'h-80 overflow-y-hidden': !expanded,
            'overflow-auto': expanded,
          }"
        >
          <p class="text-lg font-semibold">Cerita Penggalangan Dana</p>

          <div
            v-html="campaignStore.currentCampaign.story"
            class="mt-3 leading-relaxed overflow-hidden h-full"
            :class="{ 'max-h-full': !expanded, 'max-h-none': expanded }"
          ></div>

          <!-- Gradient Penutup -->
          <div
            v-show="!expanded"
            class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"
          ></div>

          <!-- Tombol "Baca Selengkapnya" -->
          <Button
            v-show="!expanded"
            variant="success"
            @click="expanded = true"
            class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 z-10"
          >
            Baca Selengkapnya
          </Button>

          <!-- Tombol "Tutup" -->
          <div class="flex justify-center">
            <Button
              v-show="expanded"
              variant="success"
              @click="expanded = false"
              class="px-4 py-2 mt-4"
            >
              Tutup
            </Button>
          </div>
        </div>

        <div class="my-4 p-4 border shadow-sm rounded-sm flex flex-col">
          <RouterLink
            to=""
            class="py-2 border-b flex items-center justify-between"
          >
            <div>
              <div class="flex items-center gap-x-8">
                <p class="font-medium">Kabar Terbaru</p>
                <Badge variant="success">{{
                  campaignStore.currentCampaign._count?.news
                }}</Badge>
              </div>

              <div
                class="mt-2 text-xs flex items-center text-gray-700"
                v-if="
                  campaignStore.currentCampaign.fund_disbursement_histories?.[0]
                    ?.updated_at
                "
              >
                <p>Terakhir pencairan dana</p>
                <div class="w-1 h-1 bg-gray-700 mx-2 rounded-full"></div>
                <p>
                  {{
                    new Date(
                      campaignStore.currentCampaign.fund_disbursement_histories[0].updated_at
                    ).toDateString()
                  }}
                </p>
              </div>
            </div>

            <ChevronRight />
          </RouterLink>
          <RouterLink
            to=""
            class="py-2 mt-2 border-b flex items-center justify-between"
          >
            <div>
              <div class="flex items-center gap-x-8">
                <p class="font-medium">Pencairan Dana</p>
                <Badge variant="success">{{
                  campaignStore.currentCampaign._count
                    ?.fund_disbursement_histories
                }}</Badge>
              </div>

              <div
                class="mt-2 text-xs flex items-center text-gray-700"
                v-if="campaignStore.currentCampaign.news?.[0]?.updated_at"
              >
                <p>Terakhir pencairan dana</p>
                <div class="w-1 h-1 bg-gray-700 mx-2 rounded-full"></div>
                <p>
                  {{
                    new Date(
                      campaignStore.currentCampaign.news[0].updated_at
                    ).toDateString()
                  }}
                </p>
              </div>
            </div>

            <ChevronRight />
          </RouterLink>
          <RouterLink
            to=""
            class="py-2 mt-2 border-b flex items-center justify-between"
          >
            <div class="flex items-center gap-x-8">
              <p class="font-medium">Riwayat Donasi</p>
              <Badge variant="success">{{
                campaignStore.currentCampaign._count?.donation_histories
              }}</Badge>
            </div>

            <ChevronRight />
          </RouterLink>
        </div>

        <div
          v-show="
            campaignStore.currentCampaign.is_active &&
            new Date(campaignStore.currentCampaign.end_at) > new Date()
          "
          class="my-4 p-6 border shadow-sm rounded-md bg-white"
        >
          <form @submit="onSubmit" class="flex flex-col gap-4">
            <FormField v-slot="{ componentField }" name="amount">
              <FormItem>
                <FormLabel class="text-sm font-medium text-gray-700"
                  >Amount</FormLabel
                >
                <FormControl>
                  <div class="relative w-full">
                    <Input
                      type="number"
                      placeholder="0"
                      step="0.01"
                      class="w-full !pr-14 !pl-4 !py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 no-spinner selection:bg-gray-300 selection:text-black"
                      v-bind="componentField"
                    />
                    <span
                      class="absolute inset-y-0 right-4 flex items-center text-gray-500 text-sm pointer-events-none"
                    >
                      TON
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="flex justify-between items-center text-xs">
              <p>Balance: {{ balance }} TON</p>
              <p>Setara Dengan: {{ totalAmount }}</p>
            </div>

            <Button
              type="submit"
              variant="success"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
            >
              Donasi
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import useCampaignStore from "@/stores/campaign-store";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { ChevronRight } from "lucide-vue-next";
import Badge from "@/components/ui/badge/Badge.vue";
import CampaignProfileCard from "@/components/CampaignProfileCard.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";
import getTonPrice from "@/utils/checkTonPrice";
import { useTonConnect, useSendMessage } from "@d0rich/vueton";
import { Address, toNano, beginCell } from "@ton/core";
import { connectWallet } from "@/utils/connectionWallet";
import showToast from "@/utils/showToast";
import { contractAddress } from "@/utils/environment";
import getLastTransactionsLink from "@/utils/getLastTransactionLink";

const { tonClient, tonNetwork, sendTransaction } = useTonConnect();
const walletAddress = sessionStorage.getItem("walletAddress") ?? "";
const balance = ref("0");
const tonPrice = ref(0);
const isConnected = ref(false);
const route = useRoute();
const queryId = Number(route.params.id);
const campaignStore = useCampaignStore();
const expanded = ref(false);
const formScheme = toTypedSchema(
  z.object({
    amount: z
      .number()
      .positive()
      .refine(
        (value) => {
          return Number.isInteger(value * 100);
        },
        {
          message: "Amount maksimal 2 angka di belakang koma",
        }
      ),
  })
);

const { resetForm, handleSubmit, values } = useForm({
  validationSchema: formScheme,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    if (tonNetwork.value !== "testnet") {
      await connectWallet();
      return;
    }

    const amount = values.amount;
    const { sendMessage, success, fail } = useSendMessage({
      sendMessageFn: async () => {
        const messageCell = beginCell()
          .storeUint(0x6df5405e, 32)
          .storeUint(queryId, 32)
          .storeUint(toNano(amount), 256)
          .endCell();

        const contract = Address.parse(contractAddress!);

        await sendTransaction({
          to: contract,
          value: toNano(amount),
          bounce: true,
          body: messageCell,
        });
      },
    });

    await sendMessage();

    if (success.value) {
      const lastTransactionlink = await getLastTransactionsLink(walletAddress);
      await Promise.all([
        campaignStore.updateBalanceAndCollected(
          queryId,
          amount,
          lastTransactionlink
        ),
        campaignStore.getCampaign(queryId),
      ]);
      showToast("success", "success", "success donation");
      resetForm();
    }

    if (fail.value) {
      showToast("error", "error", "failed donation");
    }
  } catch (err: any) {
    showToast("error", "error", err.message);
  }
});

const totalAmount = computed(() => {
  return (tonPrice.value * (values.amount ?? 0)).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
});

const getWalletBalance = async () => {
  balance.value = (
    Number(await tonClient.value?.getBalance(Address.parse(walletAddress))) /
    1_000_000_000
  ).toFixed(2);
};

watch(
  () => tonNetwork.value,
  async (value) => {
    if (value !== "testnet") {
      isConnected.value = false;
      balance.value = "0";
      return;
    }

    await getWalletBalance();
    isConnected.value = true;
  },
  { immediate: true }
);

onMounted(async () => {
  await campaignStore.getCampaign(queryId);
  tonPrice.value = await getTonPrice();
  if (walletAddress !== "") {
    await getWalletBalance();
  }
});
</script>

<style scoped>
:deep(.campaign_story img) {
  display: block;
  margin: 1rem auto;
  max-width: 100%;
  height: auto;
}

.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-spinner {
  -moz-appearance: textfield;
}
</style>
