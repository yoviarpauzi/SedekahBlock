<template>
  <div>
    <DataTable :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { columns } from "@/components/admin/table/categories/columns";
import DataTable from "@/components/admin/table/categories/DataTable.vue";
import { useRoute } from "vue-router";
import useCategoryStore from "@/stores/categoryStore";

const route = useRoute();
const categoryStore = useCategoryStore();

const getCategoryData = async () => {
  const page: string = route.query.page?.toString() ?? "1";
  const search: string = route.query.search?.toString() ?? "";
  await categoryStore.fetchCategories(search, page);
};

watch(
  () => route.query,
  async () => {
    await getCategoryData();
  }
);

onMounted(async () => {
  await getCategoryData();
});
</script>
