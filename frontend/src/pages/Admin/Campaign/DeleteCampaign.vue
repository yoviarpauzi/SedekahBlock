<template>
  <AlertDialog v-model:open="isDeleteOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete campaigns
          and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="closeDeleteDialog">Cancel</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
          @click="deleteCampaign"
          >Delete</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import showToast from "@/utils/showToast";
import useCampaignStore from "@/stores/campaign-store";
import { useTonConnect, useSendMessage } from "@d0rich/vueton";
import { contractAddress } from "@/utils/environment";
import { Address, toNano, beginCell } from "@ton/core";
import { useRouter } from "vue-router";

const props = defineProps<{
  campaign: {
    id?: number;
    title: string;
  };
}>();

const isDeleteOpen = defineModel<boolean>("isDeleteOpen");
const { sendTransaction } = useTonConnect();
const campaignStore = useCampaignStore();
const router = useRouter();

const closeDeleteDialog = () => {
  isDeleteOpen.value = false;
};

const deleteCampaign = async () => {
  try {
    closeDeleteDialog();
    const { sendMessage, success, fail } = useSendMessage({
      sendMessageFn: async () => {
        const messageCell = beginCell()
          .storeUint(0x9b6ac5de, 32)
          .storeUint(props.campaign.id!, 32)
          .endCell();

        const contract = Address.parse(contractAddress!);

        await sendTransaction({
          to: contract,
          value: toNano("0.05"),
          bounce: true,
          body: messageCell,
        });
      },
    });

    await sendMessage();

    if (success.value) {
      await campaignStore.deleteCampaign(props.campaign.id!);
      showToast("success", "success", "success delete campaign");
      router.replace("/admin/campaigns");
    }

    if (fail.value) {
      showToast("error", "error", "failed delete campaign");
    }
  } catch (err: any) {
    showToast("error", "error", err.message);
  }
};
</script>
