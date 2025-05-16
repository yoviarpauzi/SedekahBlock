<template>
  <div>
    <DataTable :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { columns } from "@/components/admin/table/campaign/columns";
import DataTable from "@/components/admin/table/campaign/DataTable.vue";
import useCampaignStore from "@/stores/campaignStore";
import { useRoute } from "vue-router";

const campaignStore = useCampaignStore();
const route = useRoute();

onMounted(async () => {
  const page = Number(route.query.page) ?? 1;
  const search = route.query.search?.toString() ?? "";
  await campaignStore.getCampaigns(page, search);
});
</script>
