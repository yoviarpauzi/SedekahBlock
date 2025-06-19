<template>
  <div>
    <div class="mb-5 flex items-center justify-between gap-x-4">
      <Input
        class="max-w-sm selection:bg-gray-300 selection:text-black"
        placeholder="Search title..."
        :model-value="table.getColumn('title')?.getFilterValue() as string"
        @update:model-value="table.getColumn('title')?.setFilterValue($event)"
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
                <Skeleton v-if="news.isLoading" class="h-4 w-full" />
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
        <span class="font-semibold">{{ news.rowCount }}</span>
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
import type { ColumnDef } from "@tanstack/vue-table";
import Input from "@/components/ui/input/Input.vue";
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
import { onMounted, ref } from "vue";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import axios from "axios";
import { serverURI } from "@/utils/environment";
import { useRoute } from "vue-router";

interface NewsData {
  id: number;
  title: string;
  body: string;
}

interface News {
  data: NewsData[];
  rowCount: number;
  isLoading: boolean;
}

const route = useRoute();
const paramsId = route.params.id;
const news = ref<News>({
  data: [],
  rowCount: 0,
  isLoading: false,
});

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
}>();

const table = useVueTable({
  get data() {
    return news.value.data as TData[];
  },
  get columns() {
    return props.columns;
  },
  get rowCount() {
    return news.value.rowCount;
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
  news.value.isLoading = true;

  const response = await axios
    .get(`${serverURI}/api/campaigns/id/${paramsId}/news`)
    .finally(() => {
      news.value.isLoading = false;
    });

  console.log(response.data);
  news.value.data = response.data.news ?? [];
  news.value.rowCount = response.data.rowCount;
});
</script>
