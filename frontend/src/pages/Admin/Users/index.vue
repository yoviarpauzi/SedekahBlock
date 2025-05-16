<template>
  <div>
    <DataTable :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { columns } from "@/components/admin/table/user/columns";
import DataTable from "@/components/admin/table/user/DataTable.vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUsers();
});
</script>
