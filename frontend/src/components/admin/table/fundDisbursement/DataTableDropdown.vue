<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <RouterLink
        :to="`/admin/campaigns/details/${campaignId}/withdraw/${withdraw.id}/update`"
      >
        <DropdownMenuItem>Update</DropdownMenuItem>
      </RouterLink>
      <DropdownMenuItem @click="deleteWithdraw">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
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
import { useRoute } from "vue-router";
import showToast from "@/utils/showToast";
import useWithdrawStore from "@/stores/withdraw-store";

const props = defineProps<{
  withdraw: {
    id: number;
    amount: number;
    title: string;
    body: string;
  };
}>();

const route = useRoute();
const campaignId = Number(route.params.id);
const withdrawStore = useWithdrawStore();

const deleteWithdraw = async () => {
  try {
    await withdrawStore.delete(campaignId, props.withdraw.id);
    showToast("success", "success", "success delete withdraw");
  } catch (err: any) {
    showToast("error", "error", "failed delete withdraw");
  }
};
</script>
