<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
    <div class="mb-5 flex items-center justify-between">
      <Input
        class="max-w-sm selection:bg-gray-300 selection:text-black"
        placeholder="Search name..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />

      <CreateCategory />
    </div>
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
                <Skeleton v-if="categoryStore.isLoading" class="h-4 w-full" />
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
        <span class="font-semibold">{{ categoryStore.rowCount }}</span>
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
  </div>
</template>

<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, ColumnFiltersState } from "@tanstack/vue-table";
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
  getFilteredRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import Input from "@/components/ui/input/Input.vue";
import CreateCategory from "./CreateCategory.vue";
import useCategoryStore from "@/stores/categoryStore";
import { ref } from "vue";
import { valueUpdater } from "@/components/ui/table/utils";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
}>();

const categoryStore = useCategoryStore();
const columnFilters = ref<ColumnFiltersState>([]);

const table = useVueTable({
  get data() {
    return categoryStore.data as TData[];
  },
  get columns() {
    return props.columns;
  },
  get rowCount() {
    return categoryStore.rowCount;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  autoResetPageIndex: false,
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 5,
    },
  },
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get columnFilters() {
      return columnFilters.value;
    },
  },
});
</script>
