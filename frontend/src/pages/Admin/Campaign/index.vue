<template>
  <div>
    <DataTable :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { columns } from "@/components/admin/table/campaign/columns";
import DataTable from "@/components/admin/table/campaign/DataTable.vue";
import useCampaignStore from "@/stores/campaign-store";
import { watch } from "vue";
import { useRoute } from "vue-router";

const campaignStore = useCampaignStore();
const route = useRoute();

onMounted(async () => {
  await campaignStore.getCampaigns();
});

watch(
  () => route.fullPath,
  async () => {
    await campaignStore.getCampaigns(10);
  }
);
</script>
