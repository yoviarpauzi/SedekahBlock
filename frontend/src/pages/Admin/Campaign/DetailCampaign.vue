<template>
  <div class="space-x-4">
    <RouterLink :to="`/admin/campaigns/edit/${queryId}`">
      <Button>Update</Button>
    </RouterLink>
    <Button variant="destructive" @click="openDeleteDialog">Delete</Button>
    <Button
      :variant="
        campaignStore.currentCampaign.is_active ? 'destructive' : 'success'
      "
    >
      {{ campaignStore.currentCampaign.is_active ? "Deactivate" : "Activate" }}
    </Button>
  </div>

  <CampaignProfileCard :campaign="campaignStore.currentCampaign" />

  <div class="p-4 bg-white shadow-sm border rounded-md campaign_story relative">
    <p class="text-lg font-semibold">Cerita Penggalangan Dana</p>

    <div
      v-html="campaignStore.currentCampaign.story"
      class="mt-3 leading-relaxed overflow-y-auto max-h-80"
    ></div>
  </div>

  <DeleteCampaign
    :campaign="campaignStore.currentCampaign"
    v-model:is-delete-open="isDeleteOpen"
  />
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import useCampaignStore from "@/stores/campaign-store";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CampaignProfileCard from "@/components/CampaignProfileCard.vue";
import DeleteCampaign from "./DeleteCampaign.vue";

const route = useRoute();
const queryId = Number(route.params.id);
const campaignStore = useCampaignStore();
const isDeleteOpen = ref(false);

const openDeleteDialog = () => {
  isDeleteOpen.value = true;
};

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
