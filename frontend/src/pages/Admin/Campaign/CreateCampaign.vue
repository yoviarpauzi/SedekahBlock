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
import useCategoryStore from "@/stores/categoryStore";
import getTonPrice from "@/utils/checkTonPrice";
import axios, { AxiosError } from "axios";
import { toTypedSchema } from "@vee-validate/zod";
import { serverURI } from "@/utils/environment";
import { ref, onMounted } from "vue";
import showToast from "@/utils/showToast";
import { useRouter } from "vue-router";
import CampaignForm from "@/components/admin/CampaignForm.vue";
import useCampaignStore from "@/stores/campaignStore";

const router = useRouter();
const tonPrice = ref<number>(0);
const campaignStore = useCampaignStore();

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
            `${serverURI}/api/campaigns/check?title=${title}`
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
    campaign_story: z.string(),
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
  tonPrice.value = await getTonPrice();
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

    await campaignStore.addCampaign(form);
    showToast("success", "success", "success create campaign");
    resetForm();
    router.push("/admin/campaigns");
  } catch (err) {
    if (err instanceof AxiosError) {
      showToast("error", "error", err.message);
    }
  }
});
</script>
