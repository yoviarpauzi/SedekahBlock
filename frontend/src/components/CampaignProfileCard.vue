<template>
  <div class="bg-white shadow-sm pb-4 mb-4 border rounded-md">
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
        <p class="font-bold text-green-800">
          {{ availableDonation(campaign.balance) }} TON
        </p>
      </div>

      <p class="text-xs text-gray-600">Donasi Terkumpul</p>

      <div class="flex items-center justify-between">
        <p class="mt-1 text-base text-gray-700">
          <span class="font-bold text-green-600">
            {{ campaign.collected }} TON
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { serverURI } from "@/utils/environment";
import { computed } from "vue";
import Progress from "./ui/progress/Progress.vue";
import availableDonation from "@/utils/availableDonation";
import { Heart } from "lucide-vue-next";

const props = defineProps<{
  campaign: {
    title: string;
    target: number;
    balance: number;
    collected: number;
    end_at: Date;
    thumbnail: string | File;
    story: string;
    created_at: Date;
    _count?: {
      donation_histories?: number;
    };
  };
}>();

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
</script>
