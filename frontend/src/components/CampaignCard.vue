<template>
  <RouterLink
    :to="`/campaigns/details/${campaign.id}`"
    class="flex flex-col bg-white rounded-md shadow h-72 cursor-pointer transform transition duration-300"
  >
    <div class="w-full h-56 rounded-t-md overflow-hidden">
      <img
        :src="`${serverURI}/${campaign.thumbnail}`"
        :alt="`campaign-${campaign.id}`"
        class="w-full h-full rounded-t-md object-cover"
      />
    </div>

    <div class="p-4">
      <p class="text-xs">Pribumi Untuk Negeri</p>
      <p class="font-medium mt-2">{{ campaign.title }}</p>
      <div class="mt-3 flex flex-col gap-y-2">
        <p class="text-sm font-medium">
          Terkumpul
          <span class="text-green-800 font-medium">
            {{ campaign.collected }}
          </span>
          TON
        </p>
        <Progress :model-value="progress" />
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { serverURI } from "@/utils/environment";
import { Progress } from "@/components/ui/progress";
import { computed } from "vue";

interface Campaign {
  id?: number;
  title: string;
  target: number;
  balance: number;
  collected: number;
  end_at: Date;
  thumbnail: string | File;
}

const props = defineProps<{
  campaign: Campaign;
}>();

const progress = computed(() => {
  if (!props.campaign.target) return 0;
  return (props.campaign.collected / props.campaign.target) * 100;
});
</script>
