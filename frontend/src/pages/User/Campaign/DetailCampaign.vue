<template>
  <div class="container pt-20">
    <div class="grid lg:grid-cols-3 lg:gap-x-4">
      <div class="lg:col-span-1">
        <div class="bg-white shadow-sm pb-4 mb-4 border rounded-md">
          <div class="w-full h-52">
            <img
              :src="`${serverURI}/${campaignStore.currentCampaign.thumbnail}`"
              alt=""
              class="object-cover w-full h-full rounded-md"
            />
          </div>

          <h4 class="text-lg font-semibold mt-6 px-4">
            {{ campaignStore.currentCampaign.title }}
          </h4>

          <div class="mt-4 px-4">
            <div class="mb-2">
              <p class="text-xs text-gray-600">Donasi Tersedia</p>
              <p class="font-bold text-green-800">
                {{ campaignStore.currentCampaign.balance }} TON
              </p>
            </div>

            <p class="text-xs text-gray-600">Donasi Terkumpul</p>

            <p class="mt-1 text-base text-gray-700">
              <span class="font-bold text-green-600">
                {{ campaignStore.currentCampaign.collected }} TON
              </span>
              <span class="text-sm font-medium text-gray-600">
                dari target
              </span>
              <span class="font-semibold">
                {{ campaignStore.currentCampaign.target }} TON
              </span>
            </p>

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
                {{ campaignStore.currentCampaign._count?.donation_histories }}
                Donasi
              </p>
            </div>
          </div>
        </div>
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
              <p class="font-medium">Donasi</p>
              <Badge variant="success">{{
                campaignStore.currentCampaign._count?.donation_histories
              }}</Badge>
            </div>

            <ChevronRight />
          </RouterLink>
        </div>

        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Progress from "@/components/ui/progress/Progress.vue";
import useCampaignStore from "@/stores/campaign-store";
import { serverURI } from "@/utils/environment";
import { onMounted, computed, ref } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { ChevronRight, Heart } from "lucide-vue-next";
import Badge from "@/components/ui/badge/Badge.vue";

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
});
</script>

<style scoped>
.campaign_story ::v-deep img {
  display: block;
  margin: 1rem auto;
  max-width: 100%;
  height: auto;
}
</style>
