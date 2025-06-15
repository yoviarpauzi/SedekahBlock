<template>
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Create Campaign</h2>
  <CampaignForm
    :submit="createCampaign"
    :set-field-value="setFieldValue"
    action="Create"
    :is-field-dirty="isFieldDirty"
    :values="values"
  />
</template>

<script setup lang="ts">
import z from "zod";
import { useForm } from "vee-validate";
import useCategoryStore from "@/stores/category-store";
import axios from "axios";
import { toTypedSchema } from "@vee-validate/zod";
import { contractAddress, serverURI } from "@/utils/environment";
import { onMounted } from "vue";
import showToast from "@/utils/showToast";
import { useRouter } from "vue-router";
import CampaignForm from "@/components/admin/CampaignForm.vue";
import useCampaignStore from "@/stores/campaign-store";
import { useSendMessage, useTonConnect } from "@d0rich/vueton";
import { Address, toNano, beginCell } from "@ton/core";

const router = useRouter();
const campaignStore = useCampaignStore();
const { sendTransaction } = useTonConnect();

const formSchema = toTypedSchema(
  z.object({
    thumbnail: z
      .instanceof(File)
      .refine((file) => file?.size <= 5000000, `Max image size is 5MB.`)
      .refine(
        (file) =>
          [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/avif",
          ].includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
    title: z
      .string()
      .max(100)
      .refine(
        async (title) => {
          const res = await axios.get(
            `${serverURI}/api/campaigns/check?title=${title}`,
            {
              withCredentials: true,
            }
          );
          const { data } = res.data;
          return !data;
        },
        {
          message: "campaign title is already exists",
        }
      ),
    categories_id: z.number(),
    target: z
      .number()
      .positive()
      .refine(
        (value) => {
          return Number.isInteger(value * 100);
        },
        {
          message: "Target maksimal 2 angka di belakang koma",
        }
      ),
    end_at: z.string(),
    story: z.string(),
  })
);

const { isFieldDirty, handleSubmit, resetForm, setFieldValue, values } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      target: 0,
    },
  });

const categoryStore = useCategoryStore();

onMounted(async () => {
  await categoryStore.fetchCategories();
});

const createCampaign = handleSubmit(async (values) => {
  try {
    const form = new FormData();
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const typedKey = key as keyof typeof values;
        const value = values[typedKey];
        if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, value.toString());
        }
      }
    }

    const campaign = await campaignStore.addCampaign(form);

    const { sendMessage, success, fail } = useSendMessage({
      sendMessageFn: async () => {
        const messageCell = beginCell()
          .storeUint(0x9971f0f9, 32)
          .storeUint(campaign.id, 32)
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
      showToast("success", "success", "success create campaign");
    }

    if (fail.value) {
      await campaignStore.deleteCampaign(campaign.id);
      showToast("error", "error", "failed create campaign");
    }

    resetForm();
    router.push("/admin/campaigns");
  } catch (err: any) {
    showToast("error", "error", err.message);
  }
});
</script>
