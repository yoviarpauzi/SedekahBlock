<template>
  <div class="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <Skeleton v-if="withdrawStore.isLoading" class="h-4 w-full" />
              <FlexRender
                v-else
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
  <div class="flex items-center justify-between py-4">
    <p class="text-xs font-medium text-gray-600">
      Total Data:
      <span class="font-semibold">{{ withdrawStore.rowCount }}</span>
    </p>
    <div class="space-x-4">
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        Next
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from "@tanstack/vue-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button.vue";
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { onMounted } from "vue";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import { useRoute } from "vue-router";
import useWithdrawStore from "@/stores/withdraw-store";

const route = useRoute();
const campaignId = route.params.id;
const withdrawStore = useWithdrawStore();

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
}>();

const table = useVueTable({
  get data() {
    return withdrawStore.data as TData[];
  },
  get columns() {
    return props.columns;
  },
  get rowCount() {
    return withdrawStore.rowCount;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  autoResetPageIndex: false,
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  },
});

onMounted(async () => {
  withdrawStore.getWithdraws(Number(campaignId));
});
</script>
