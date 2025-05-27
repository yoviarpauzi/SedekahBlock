<template>
  <div class="container pt-20">
    <div class="bg-white shadow-sm pb-4 mb-4 border rounded-md">
      <div class="w-full h-52 md:h-[28rem]">
        <img
          :src="`${serverURI}/${campaignStore.currentCampaign.thumbnail}`"
          alt=""
          class="object-cover w-full h-full rounded-md"
        />
      </div>

      <h4 class="text-lg font-semibold text-gray-800 mt-6 px-4">
        {{ campaignStore.currentCampaign.title }}
      </h4>

      <div class="mt-4 px-4">
        <p class="text-sm text-gray-600">Donasi Terkumpul</p>

        <p class="mt-1 text-base text-gray-700">
          <span class="text-xl font-bold text-green-700">
            {{ campaignStore.currentCampaign.collected }} TON
          </span>
          <span class="text-sm font-medium text-gray-600"> dari target </span>
          <span class="font-semibold text-gray-800">
            {{ campaignStore.currentCampaign.target }} TON
          </span>
        </p>

        <div class="mt-3">
          <Progress :model-value="progress" />
        </div>
      </div>
    </div>

    <div
      class="p-4 bg-white shadow-sm border my-4 rounded-md campaign_story relative"
      :class="{
        'h-80 overflow-y-hidden': !expanded,
        'overflow-auto': expanded,
      }"
    >
      <p class="text-lg font-semibold">Cerita Penggalangan Dana</p>

      <div
        v-html="campaignStore.currentCampaign.campaign_story"
        class="mt-3 leading-relaxed overflow-hidden h-full"
        :class="{ 'max-h-full': !expanded, 'max-h-none': expanded }"
      ></div>

      <div
        v-if="!expanded"
        class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"
      ></div>

      <Button
        v-if="!expanded"
        variant="success"
        @click="expanded = true"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2"
      >
        Baca Selengkapnya
      </Button>

      <div class="flex justify-center">
        <Button
          v-if="expanded"
          variant="success"
          @click="expanded = false"
          class="px-4 py-2 mt-4"
        >
          Tutup
        </Button>
      </div>
    </div>

    <div class="my-4 p-4">
      <h4>Kabar Terbaru</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Progress from "@/components/ui/progress/Progress.vue";
import useCampaignStore from "@/stores/campaignStore";
import { serverURI } from "@/utils/environment";
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const queryId = Number(route.params.id);

const campaignStore = useCampaignStore();

const expanded = ref(false);

const progress = computed(() => {
  if (!campaignStore.currentCampaign.target) return 0;
  return (
    (campaignStore.currentCampaign.collected /
      campaignStore.currentCampaign.target) *
    100
  );
});

onMounted(async () => {
  await campaignStore.getCampaign(queryId);
  console.log(campaignStore.currentCampaign);
});
</script>

<style scoped>
.campaign_story ::deep img {
  display: block;
  margin: 1rem auto;
  max-width: 100%;
  height: auto;
}
</style>
