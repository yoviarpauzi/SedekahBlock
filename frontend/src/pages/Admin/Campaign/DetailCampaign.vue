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
      @click="deactivateCampaign"
    >
      {{ campaignStore.currentCampaign.is_active ? "Deactivate" : "Activate" }}
    </Button>
    <Button
      variant="success"
      v-if="
        (!campaignStore.currentCampaign.is_active ||
          new Date(campaignStore.currentCampaign.end_at) < new Date()) &&
        !campaignStore.currentCampaign.is_admin_withdraw &&
        campaignStore.currentCampaign?._count?.fund_disbursement_histories! > 0 && campaignStore.currentCampaign.operational_costs > 0
      "
      @click="adminWithdraw"
      >Admin Withdraw</Button
    >
  </div>

  <CampaignProfileCard :campaign="campaignStore.currentCampaign" />

  <div class="p-4 bg-white shadow-sm border rounded-md campaign_story relative">
    <p class="text-lg font-semibold">Cerita Penggalangan Dana</p>

    <div
      v-html="campaignStore.currentCampaign.story"
      class="mt-3 leading-relaxed overflow-y-auto max-h-80"
    ></div>
  </div>

  <!-- Withdraw -->
  <div class="p-4 bg-white shadow-sm border rounded-md campaign_story relative">
    <p class="text-lg font-semibold">Pencairan Dana</p>
    <div class="flex justify-end my-4 gap-x-4">
      <RouterLink :to="`/admin/campaigns/details/${queryId}/withdraw/create`">
        <Button variant="success">Make Withdraw</Button>
      </RouterLink>
    </div>

    <div>
      <WithdrawTable />
    </div>
  </div>

  <!-- News -->
  <div class="p-4 bg-white shadow-sm border rounded-md campaign_story relative">
    <p class="text-lg font-semibold">Kabar Terbaru</p>
    <div class="flex justify-end my-4">
      <RouterLink :to="`/admin/campaigns/details/${queryId}/news/create`">
        <Button variant="success">Add News</Button>
      </RouterLink>
    </div>

    <div>
      <NewsTable />
    </div>
  </div>

  <!-- Transfer -->
  <div class="p-4 bg-white shadow-sm border rounded-md campaign_story relative">
    <p class="text-lg font-semibold">Transfer</p>
    <div class="flex justify-end my-4">
      <RouterLink :to="`/admin/campaigns/details/${queryId}/news/create`">
        <Button variant="success">Make Transfer</Button>
      </RouterLink>
    </div>

    <div>
      <NewsTable />
    </div>
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
import axios from "axios";
import { serverURI } from "@/utils/environment";
import showToast from "@/utils/showToast";
import NewsTable from "./NewsTable.vue";
import WithdrawTable from "./WithdrawTable.vue";

const route = useRoute();
const queryId = Number(route.params.id);
const campaignStore = useCampaignStore();
const isDeleteOpen = ref(false);

const openDeleteDialog = () => {
  isDeleteOpen.value = true;
};

const deactivateCampaign = async () => {
  try {
    await axios.patch(`${serverURI}/api/campaigns/id/${queryId}/status`);
    showToast("success", "success", "success change campaign status");
    await campaignStore.getCampaign(queryId);
  } catch (err: any) {
    showToast("error", "error", err.message);
  }
};

const adminWithdraw = async () => {
  try {
    
  } catch (err) {
    showToast("error", "error", "failed admin withdraw");
  }
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
