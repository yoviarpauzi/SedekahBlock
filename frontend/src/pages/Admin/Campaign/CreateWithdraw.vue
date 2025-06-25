<template>
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Create Withdraw</h2>
  <div v-if="!isLoaded" class="text-center py-4">Loading...</div>
  <WithdrawForm
    v-else
    :submit="createWithdraw"
    :set-field-value="setFieldValue"
    action="Create"
    :is-field-dirty="isFieldDirty"
    :values="values"
  />
</template>

<script setup lang="ts">
import WithdrawForm from "@/components/admin/WithdrawForm.vue";
import z from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useRoute, useRouter } from "vue-router";
import showToast from "@/utils/showToast";
import useCampaignStore from "@/stores/campaign-store";
import useWithdrawStore from "@/stores/withdraw-store";
import { onMounted, ref, computed } from "vue";
import { useTonConnect, useSendMessage } from "@d0rich/vueton";
import { beginCell, toNano, Address } from "@ton/core";
import { contractAddress } from "@/utils/environment";

const route = useRoute();
const router = useRouter();
const campaignStore = useCampaignStore();
const campaignId = Number(route.params.id);
const maxWithdraw = ref(0);
const isLoaded = ref(false);
const withdrawStore = useWithdrawStore();
const { sendTransaction } = useTonConnect();

const formScheme = computed(() =>
  toTypedSchema(
    z.object({
      amount: z
        .number()
        .min(1)
        .refine(
          (value) => {
            return value <= maxWithdraw.value;
          },
          {
            message: `Amount tidak boleh lebih dari ${maxWithdraw.value}`,
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
      title: z.string().max(100),
      body: z.string(),
    })
  )
);

const { resetForm, handleSubmit, values, setFieldValue, isFieldDirty } =
  useForm({
    validationSchema: formScheme,
  });

const createWithdraw = handleSubmit(async (values) => {
  try {
    const { sendMessage, success, fail } = useSendMessage({
      sendMessageFn: async () => {
        const messageCell = beginCell()
          .storeUint(3009169275, 32)
          .storeUint(campaignId, 32)
          .storeUint(toNano(values.amount), 256)
          .endCell();

        const contract = Address.parse(contractAddress!);

        await sendTransaction({
          to: contract,
          value: toNano(0.05),
          bounce: true,
          body: messageCell,
        });
      },
    });

    await sendMessage();

    if (success.value) {
      await withdrawStore.create(
        campaignId,
        values.amount,
        values.title,
        values.body
      );

      showToast("success", "Success", "withdraw created successfully");
      resetForm();
    }

    if (fail.value) {
      showToast("error", "Error", "failed to create withdraw");
    }
  } catch (err) {
    showToast("error", "Error", "failed to create withdraw");
  } finally {
    router.push(`/admin/campaigns/details/${campaignId}`);
  }
});

onMounted(async () => {
  try {
    await campaignStore.getCampaign(campaignId);
    maxWithdraw.value = Number(campaignStore.currentCampaign.balance);

    isLoaded.value = true;
  } catch (error) {
    showToast("error", "Error", "Failed to load campaign data");
  }
});
</script>
