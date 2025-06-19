<template>
  <DataTable :columns="columns" />
</template>

<script setup lang="ts">
import DataTable from "@/components/admin/table/news/DataTable.vue";
import { columns } from "@/components/admin/table/news/column";
</script>
