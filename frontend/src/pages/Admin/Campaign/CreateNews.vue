<template>
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Create News</h2>
  <NewsForm
    :submit="createNews"
    :set-field-value="setFieldValue"
    action="Create"
    :is-field-dirty="isFieldDirty"
    :values="values"
  />
</template>

<script setup lang="ts">
import NewsForm from "@/components/admin/NewsForm.vue";
import z from "zod";
import { useForm } from "vee-validate";
import axios from "axios";
import { toTypedSchema } from "@vee-validate/zod";
import { useRoute, useRouter } from "vue-router";
import { serverURI } from "@/utils/environment";
import showToast from "@/utils/showToast";
import useNewsStore from "@/stores/news-store";

const formSchema = toTypedSchema(
  z.object({
    title: z.string().max(100),
    body: z.string(),
  })
);

const route = useRoute();
const router = useRouter();
const campaignId = Number(route.params.id);
const newsStore = useNewsStore();

const { isFieldDirty, handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {},
});

const createNews = handleSubmit(async (values, { resetForm }) => {
  try {
    await newsStore.addNews(campaignId, values.title, values.body);
    showToast("success", "success", "success create news");
    resetForm();
    router.push(`/admin/campaigns/details/${campaignId}`);
  } catch (err: any) {
    showToast("error", "error", "failed create news");
  }
});
</script>
