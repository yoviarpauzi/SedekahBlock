<template>
  <div class="bg-white shadow-sm pb-4 border rounded-md">
    <div class="w-full h-52">
      <img
        :src="`${serverURI}/${campaign.thumbnail}`"
        alt=""
        class="object-cover w-full h-full rounded-md"
      />
    </div>

    <h4 class="text-lg font-semibold mt-6 px-4">
      {{ campaign.title }}
    </h4>

    <div class="mt-4 px-4">
      <div class="mb-2">
        <p class="text-xs text-gray-600">Donasi Tersedia</p>
        <p class="font-bold text-green-800">{{ campaign.balance }} TON</p>
      </div>

      <p class="text-xs text-gray-600">Donasi Terkumpul</p>

      <div class="flex items-center justify-between">
        <p class="mt-1 text-base text-gray-700">
          <span class="font-bold text-green-600">
            {{ Number(campaign.collected).toFixed(2) }} TON
          </span>
          <span class="text-sm font-medium text-gray-600"> dari target </span>
          <span class="font-semibold"> {{ campaign.target }} TON </span>
        </p>

        <p class="text-xs">{{ donationDaysLeft }}</p>
      </div>

      <div class="mt-3">
        <Progress :model-value="progress" />
      </div>

      <div class="mt-2 flex items-center justify-between">
        <p class="flex items-center gap-x-1 text-sm">
          <Heart
            :size="15"
            fill="green"
            stroke="none"
            :stroke-width="0"
            :stroke-opacity="0"
            class="inline"
          />
          {{ campaign._count?.donation_histories }}
          Donasi
        </p>

        <div v-if="campaign.collected >= 1">
          <Drawer>
            <DrawerTrigger>
              <p class="text-sm hover:underline">Rincian Penggunaan Dana</p>
            </DrawerTrigger>
            <DrawerContent>
              <div class="container">
                <DrawerHeader>
                  <DrawerTitle class="text-lg font-semibold">
                    Rincian Penggunaan Dana
                  </DrawerTitle>
                  <DrawerDescription class="text-left text-sm text-gray-600">
                    Detail penggunaan dana dari kampanye penggalangan ini
                  </DrawerDescription>
                </DrawerHeader>
                <div class="p-4 pb-0">
                  <div class="mb-4">
                    <div class="flex items-center gap-2 mb-2">
                      <div
                        class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <div class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span class="font-medium text-gray-700"
                        >Status Dana Terkumpul</span
                      >
                    </div>
                    <p class="text-sm text-gray-600 ml-6">
                      Penggalangan dana sudah berlangsung selama
                      {{ donationDaysLive }}
                    </p>
                  </div>
                </div>

                <div class="space-y-3">
                  <!-- Total Dana Terkumpul -->
                  <div
                    class="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                  >
                    <div class="flex items-center gap-2">
                      <span
                        class="bg-green-800 text-white text-xs px-2 py-1 rounded font-bold"
                        >{{ Number(progress).toFixed(2) }}%</span
                      >
                      <span class="font-medium">Dana terkumpul</span>
                    </div>
                    <span class="font-semibold"
                      >{{ Number(campaign.collected).toFixed(2) }} TON</span
                    >
                  </div>

                  <!-- Dana untuk penggalangan -->
                  <div class="space-y-2">
                    <div
                      class="flex justify-between items-center p-2 bg-green-50 rounded"
                    >
                      <div class="flex items-center gap-2">
                        <span
                          class="bg-green-800 text-white text-xs px-2 py-1 rounded font-bold"
                          >95%</span
                        >
                        <span class="text-sm">Donasi untuk kampanye</span>
                      </div>
                      <span class="text-sm font-medium"
                        >{{
                          Number(campaign.collected * 0.95).toFixed(2)
                        }}
                        TON</span
                      >
                    </div>

                    <!-- Detail breakdown -->
                    <div class="mx-4 space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Sudah dicairkan</span>
                        <span>{{ campaign.total_withdraw_amount }} TON</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600"
                          >Di transfer ke kampanye lain</span
                        >
                        <span
                          >{{
                            Number(campaign.total_transferred).toFixed(2)
                          }}
                          TON</span
                        >
                      </div>
                      <div class="flex justify-between font-medium">
                        <span class="text-gray-700">Belum dicairkan</span>
                        <span class="font-semibold"
                          >{{ campaign.balance }} TON</span
                        >
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div
                      class="flex justify-between items-center p-2 bg-green-50 rounded"
                    >
                      <div class="flex items-center gap-2">
                        <span
                          class="bg-green-800 text-white text-xs px-2 py-1 rounded font-bold"
                          >5%</span
                        >
                        <span class="text-sm">Biaya teknologi</span>
                      </div>
                      <span class="text-sm font-medium"
                        >{{
                          Number(campaign.operational_costs).toFixed(2)
                        }}
                        TON</span
                      >
                    </div>
                  </div>
                </div>

                <DrawerFooter>
                  <DrawerClose as-child>
                    <Button variant="success"> Tutup </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { serverURI } from "@/utils/environment";
import Button from "./ui/button/Button.vue";
import { computed, watch, ref } from "vue";
import Progress from "./ui/progress/Progress.vue";
import { Heart } from "lucide-vue-next";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const props = defineProps<{
  campaign: {
    title: string;
    target: number;
    balance: number;
    collected: number;
    operational_costs: number;
    end_at: Date;
    thumbnail: string | File;
    total_transferred: number;
    total_withdraw_amount: string;
    story: string;
    is_transfer: boolean;
    created_at: Date;
    _count?: {
      donation_histories?: number;
    };
  };
}>();

const disbursedFunds = ref("");

const progress = computed(() => {
  const collected = Number(props.campaign.collected ?? 0);
  const target = Number(props.campaign.target ?? 0);

  if (target <= 0 || isNaN(collected)) return null;

  const result = (collected / target) * 100;

  return isNaN(result) ? null : result;
});

const donationDaysLeft = computed(() => {
  const now: Date = new Date();
  const endAt: Date = new Date(props.campaign.end_at);
  const diffMs: number = endAt.getTime() - now.getTime();

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays} hari lagi` : "Donasi telah berakhir";
});

const donationDaysLive = computed(() => {
  const now = new Date();
  const createdAt = new Date(props.campaign.created_at);

  if (isNaN(createdAt.getTime())) {
    return "Tanggal tidak valid";
  }

  const diffMs = now.getTime() - createdAt.getTime();
  const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return diffDays > 0 ? `${diffDays} hari` : "Hari ini dimulai";
});

watch(
  () => props.campaign,
  (newCampaign) => {
    if (newCampaign.collected !== undefined) {
      disbursedFunds.value = Number(
        Number(newCampaign.collected ?? 0) -
          Number(newCampaign.balance ?? 0) -
          Number(newCampaign.operational_costs ?? 0)
      ).toFixed(2);
    }
  },
  { immediate: true, deep: true }
);
</script>
