<template>
  <DataTable :columns="columns" />
</template>

<script setup lang="ts">
import DataTable from "@/components/admin/table/transfer/DataTable.vue";
import { columns } from "@/components/admin/table/transfer/column";
</script>
