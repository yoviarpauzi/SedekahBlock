<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Users</h2>
    <div class="mb-5">
      <Input
        class="max-w-sm selection:bg-gray-300 selection:text-black"
        placeholder="Search name..."
        @input="updateSearch"
      />
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
                <Skeleton v-if="userStore.isLoading" class="h-4 w-full" />
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
        Total Data: <span class="font-semibold">{{ userStore.rowCount }}</span>
      </p>
      <div class="space-x-4">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="previousPage"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="nextPage"
        >
          Next
        </Button>
      </div>
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
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import { useRoute, useRouter } from "vue-router";
import Input from "@/components/ui/input/Input.vue";
import { useUserStore } from "@/stores/userStore";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
}>();

const userStore = useUserStore();

const route = useRoute();
const router = useRouter();
const pageQuery = route.query.page ?? "1";

const table = useVueTable({
  get data() {
    return userStore.data as TData[];
  },
  get columns() {
    return props.columns;
  },
  get rowCount() {
    return userStore.rowCount;
  },
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  manualFiltering: true,
  initialState: {
    pagination: {
      pageIndex: Number(pageQuery) - 1,
      pageSize: 5,
    },
  },
});

const updateSearch = async (event: Event) => {
  const input = event.target as HTMLInputElement;

  table.setState((old) => ({
    ...old,
    pagination: {
      ...old.pagination,
      pageIndex: 0,
    },
  }));

  router.push({
    query: {
      ...route.query,
      search: input.value,
      page: 1,
    },
  });
};

const previousPage = () => {
  table.previousPage();
  router.push({
    query: {
      ...route.query,
      page: Number(route.query.page) - 1,
    },
  });
};

const nextPage = () => {
  table.nextPage();
  router.push({
    query: {
      ...route.query,
      page: Number(route.query.page) + 1 || 2,
    },
  });
};
</script>
