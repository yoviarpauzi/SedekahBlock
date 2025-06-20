<template>
  <div v-if="isLoading" class="flex justify-center items-center h-64">
    <div class="text-gray-500">Loading...</div>
  </div>
  <div v-else>
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Update News</h2>
    <NewsForm
      :submit="updateNews"
      :set-field-value="setFieldValue"
      action="Update"
      :is-field-dirty="isFieldDirty"
      :values="values"
    />
  </div>
</template>

<script setup lang="ts">
import NewsForm from "@/components/admin/NewsForm.vue";
import z from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import useNewsStore from "@/stores/news-store";
import showToast from "@/utils/showToast";

const formSchema = toTypedSchema(
  z.object({
    title: z.string().max(100),
    body: z.string(),
  })
);

const route = useRoute();
const router = useRouter();
const campaignId = route.params.id;
const newsId = Number(route.params.newsId);
const newsStore = useNewsStore();
const isLoading = ref(true);

const { isFieldDirty, handleSubmit, setFieldValue, values, setValues } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      title: "",
      body: "",
    },
  });

const updateNews = handleSubmit(async (values, { resetForm }) => {
  try {
    await newsStore.updateNews(newsId, values.title, values.body);
    showToast("success", "Success", "News updated successfully");
    router.push(`/admin/campaigns/details/${campaignId}`);
    resetForm();
  } catch (err) {
    showToast("error", "Error", "Failed to update news");
  }
});

watch(
  () => newsStore.currentNews,
  (newNews) => {
    if (newNews) {
      setValues({
        title: newNews.title || "",
        body: newNews.body || "",
      });
      isLoading.value = false;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    await newsStore.getNewsItem(newsId);
  } catch (error) {
    showToast("error", "Error", "Failed to load news data");
    isLoading.value = false;
  }
});
</script>
