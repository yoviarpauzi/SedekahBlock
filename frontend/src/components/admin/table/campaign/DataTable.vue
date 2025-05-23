<template>
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Campaigns</h2>
  <div class="mb-5 flex items-center justify-between gap-x-4">
    <!-- TODO implement search campaign -->
    <!-- TODO implement sorting for name, balance, target -->
    <!-- TODO implement filter for categories_id -->
    <div class="w-full flex items-center">
      <Input
        class="max-w-sm selection:bg-gray-300 selection:text-black"
        placeholder="Search title..."
        @input="updateSearch($event)"
      />

      <Select></Select>
    </div>

    <RouterLink to="/admin/campaigns/create">
      <Button variant="success">Create</Button>
    </RouterLink>
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
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <Skeleton v-if="campaignStore.isLoading" class="h-4 w-full" />
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
  <div class="flex items-center justify-between py-4 space-x-2">
    <p class="text-xs font-medium text-gray-600">
      Total Data:
      <span class="font-semibold">{{ campaignStore.rowCount }}</span>
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
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import { useRoute } from "vue-router";
import useCampaignStore from "@/stores/campaignStore";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";

const route = useRoute();
const pageIndex = route.query.page ? Number(route.query.page) - 1 : 0;
const campaignStore = useCampaignStore();

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
}>();

const table = useVueTable({
  get data() {
    return campaignStore.data as TData[];
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  autoResetPageIndex: true,
  state: {
    pagination: {
      pageIndex: pageIndex,
      pageSize: 5,
    },
  },
  rowCount: campaignStore.rowCount,
});

const updateSearch = async (event: Event) => {
  const input: string = (event.target as HTMLInputElement).value;

  console.log(input);
};
</script>
