<template>
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Update Withdraw</h2>
  <div v-if="!isLoaded" class="text-center py-4">Loading...</div>
  <WithdrawForm
    v-else
    :submit="updateWithdraw"
    :set-field-value="setFieldValue"
    action="Update"
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
import { onMounted, ref, computed, watch } from "vue";

const route = useRoute();
const router = useRouter();
const campaignStore = useCampaignStore();
const campaignId = Number(route.params.id);
const maxWithdraw = ref(0);
const isLoaded = ref(false);
const withdrawStore = useWithdrawStore();
const withdrawId = Number(route.params.withdrawId);

const formScheme = computed(() =>
  toTypedSchema(
    z.object({
      title: z.string().max(100),
      body: z.string(),
    })
  )
);

const {
  resetForm,
  handleSubmit,
  values,
  setFieldValue,
  isFieldDirty,
  setValues,
} = useForm({
  validationSchema: formScheme,
  initialValues: {
    title: "",
    body: "",
  },
});

const updateWithdraw = handleSubmit(async (values) => {
  try {
    await withdrawStore.update(withdrawId, values.title, values.body);
    showToast("success", "Success", "withdraw updated successfully");
    resetForm();
  } catch (err) {
    showToast("error", "Error", "failed to create withdraw");
  } finally {
    router.push(`/admin/campaigns/details/${campaignId}`);
  }
});

watch(
  () => withdrawStore.currentWithdraw,
  (withdraw) => {
    if (withdraw) {
      setValues({
        title: withdraw.title || "",
        body: withdraw.body || "",
      });
      isLoaded.value = false;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    await campaignStore.getCampaign(campaignId);
    await withdrawStore.getWithdrawItem(withdrawId);
    maxWithdraw.value = Number(campaignStore.currentCampaign.balance);

    isLoaded.value = true;
  } catch (error) {
    showToast("error", "Error", "Failed to load campaign data");
  }
});
</script>
