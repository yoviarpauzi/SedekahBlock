<template>
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Create Transfer</h2>
  <div v-if="!isLoaded" class="text-center py-4">Loading...</div>
  <TransferForm
    :submit="createTransfer"
    :set-field-value="setFieldValue"
    action="Create"
    :is-field-dirty="isFieldDirty"
    :values="values"
  />
</template>

<script setup lang="ts">
import z from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useRoute, useRouter } from "vue-router";
import showToast from "@/utils/showToast";
import TransferForm from "@/components/admin/TransferForm.vue";
import useTransferStore from "@/stores/transfer-store";
import { useSendMessage, useTonConnect } from "@d0rich/vueton";
import { Address, toNano, beginCell } from "@ton/core";
import { contractAddress } from "@/utils/environment";
import { onMounted, ref, computed } from "vue";
import useCampaignStore from "@/stores/campaign-store";

const maxTransfer = ref(0);
const route = useRoute();
const router = useRouter();
const campaignId = Number(route.params.id);
const transferStore = useTransferStore();
const campaignStore = useCampaignStore();
const isLoaded = ref(false);
const { sendTransaction } = useTonConnect();
const formSchema = computed(() =>
  toTypedSchema(
    z.object({
      receiver_campaign_id: z.number(),
      amount: z
        .number()
        .min(1)
        .refine(
          (value) => {
            return value <= maxTransfer.value;
          },
          {
            message: `Amount tidak boleh lebih dari ${maxTransfer.value}`,
          }
        )
        .refine(
          (value) => {
            return Number.isInteger(value * 100);
          },
          {
            message: "Amount maksimal 2 angka di belakang koma",
          }
        ),
    })
  )
);

const { isFieldDirty, handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {},
});

const createTransfer = handleSubmit(async (values, { resetForm }) => {
  try {
    const { sendMessage, success, fail } = useSendMessage({
      sendMessageFn: async () => {
        const messageCell = beginCell()
          .storeUint(1274968171, 32)
          .storeUint(campaignId, 32)
          .storeUint(values.receiver_campaign_id, 32)
          .storeUint(toNano(values.amount), 256)
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
      await transferStore.createTransfer(
        campaignId,
        values.receiver_campaign_id,
        values.amount
      );
      showToast("success", "success", "success create transfer");
      resetForm();
    }

    if (fail.value) {
      showToast("error", "error", "failed create transfer");
    }

    router.push(`/admin/campaigns/details/${campaignId}`);
  } catch (err: any) {
    showToast("error", "error", "failed create transfer");
  }
});

onMounted(async () => {
  try {
    await campaignStore.getCampaign(campaignId);

    maxTransfer.value =
      Number(campaignStore.currentCampaign.balance) +
      Number(campaignStore.currentCampaign.operational_costs);

    isLoaded.value = true;
  } catch (err) {
    showToast("error", "Error", "failed fetch max withdraw");
  }
});
</script>
