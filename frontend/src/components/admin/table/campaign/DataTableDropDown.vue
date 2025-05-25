<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>Detail</DropdownMenuItem>
        <RouterLink :to="`/admin/campaigns/edit/${campaign.id}`">
          <DropdownMenuItem>Update</DropdownMenuItem>
        </RouterLink>
        <DropdownMenuItem @click="deleteCampaign">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-vue-next";
import showToast from "@/utils/showToast";
import useCampaignStore from "@/stores/campaignStore";

const campaignStore = useCampaignStore();

const props = defineProps<{
  campaign: {
    id: number;
    categories_id: number;
    title: string;
    target: number;
    end_at: Date;
    balance: number;
  };
}>();

const deleteCampaign = async () => {
  try {
    await campaignStore.deleteCampaign(props.campaign.id);
    showToast("success", "success", "success delete campaign");
  } catch (err: any) {
    showToast("error", "error", err.message);
  }
};
</script>
