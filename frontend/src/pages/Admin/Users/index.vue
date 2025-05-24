<template>
  <div>
    <DataTable :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { columns } from "@/components/admin/table/user/columns";
import DataTable from "@/components/admin/table/user/DataTable.vue";
import { useUserStore } from "@/stores/userStore";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();

onMounted(async () => {
  await userStore.fetchUsers();
});

watch(
  () => route.fullPath,
  async () => {
    await userStore.fetchUsers();
  }
);
</script>
