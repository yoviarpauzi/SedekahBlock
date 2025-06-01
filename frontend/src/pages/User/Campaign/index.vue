<template>
  <Feature
    v-model:campaign-search="campaignSearch"
    v-model:campaign-category="campaignCategory"
    v-model:campaign-status="campaignStatus"
  />

  <div class="container mt-8">
    <div
      v-if="campaignStore.data.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <CampaignCard
        v-for="item in campaignStore.data"
        :key="item.id"
        :campaign="item"
      />
    </div>
    <div v-else class="h-80 flex items-center justify-center">
      <p class="text-gray-500">Campaign Not Found</p>
    </div>
  </div>

  <Pagination
    v-slot="{ page }"
    :items-per-page="12"
    :total="campaignStore.rowCount"
    :default-page="page"
    class="my-4"
  >
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious />

      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === page"
        >
          {{ item.value }}
        </PaginationItem>
      </template>

      <PaginationEllipsis :index="4" />

      <PaginationNext />
    </PaginationContent>
  </Pagination>
</template>

<script setup lang="ts">
import Feature from "@/pages/User/Campaign/Feature.vue";
import useCampaignStore from "@/stores/campaign-store";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CampaignCard from "@/components/CampaignCard.vue";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const route = useRoute();
const campaignSearch = ref("");
const campaignCategory = ref("all");
const campaignStatus = ref("all");
const campaignStore = useCampaignStore();
const queryPage = route.query.page ?? "1";
const page = Number(queryPage);

watch(
  () => route.query,
  async () => {
    await campaignStore.getCampaigns(12);
  }
);

onMounted(async () => {
  await campaignStore.getCampaigns(12);
});
</script>
