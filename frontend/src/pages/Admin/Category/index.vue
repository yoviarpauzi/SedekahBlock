<template>
  <div>
    <DataTable :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { columns } from "@/components/admin/table/categories/columns";
import DataTable from "@/components/admin/table/categories/DataTable.vue";
import useCategoryStore from "@/stores/category-store";

const categoryStore = useCategoryStore();

const getCategoryData = async () => {
  await categoryStore.fetchCategories();
};

onMounted(async () => {
  await getCategoryData();
});
</script>
