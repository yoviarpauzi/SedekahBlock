<template>
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Campaigns</h2>
  <div class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center">
    <div class="w-full flex flex-col gap-4 md:flex-row md:items-center">
      <Input
        class="max-w-sm selection:bg-gray-300 selection:text-black"
        placeholder="Search title..."
        v-model="search"
      />

      <div class="flex gap-x-4 items-center">
        <Select v-model="selectCategory">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="0">All</SelectItem>
              <SelectItem
                v-for="item in categoryStore.data"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select v-model="selectType">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ongoing">Berlangsung</SelectItem>
              <SelectItem value="conclude">Berakhir</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
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
        @click="prevPage"
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
</template>

<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState } from "@tanstack/vue-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import { useRoute, useRouter } from "vue-router";
import useCampaignStore from "@/stores/campaign-store";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import useCategoryStore from "@/stores/category-store";
import { onMounted, ref, watch } from "vue";
import { valueUpdater } from "@/components/ui/table/utils";
import parseBase64ToHex from "@/utils/parseBase64ToHex";

type Type = "all" | "ongoing" | "conclude";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
}>();
const route = useRoute();
const router = useRouter();
const campaignStore = useCampaignStore();
const categoryStore = useCategoryStore();
const page = route.query.page ?? "1";
const categoryQuery = route.query.categories_id ?? "0";
const selectCategory = ref<number>(Number(categoryQuery));
const selectType = ref<Type>(
  (route.query.category_type?.toString() as Type) ?? "all"
);
const search = ref(route.query.search?.toString() ?? "");
const sorting = ref<SortingState>();

const table = useVueTable({
  get columns() {
    return props.columns;
  },
  get data() {
    return campaignStore.data as TData[];
  },
  get rowCount() {
    return campaignStore.rowCount;
  },
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  manualSorting: true,
  initialState: {
    pagination: {
      pageIndex: Number(page) - 1,
      pageSize: 10,
    },
  },
  state: {
    get sorting() {
      return sorting.value;
    },
  },
  onSortingChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, sorting);

    router.push({
      query: {
        ...route.query,
      },
    });
  },
});

const prevPage = () => {
  table.previousPage();

  router.push({
    query: {
      ...route.query,
      page: table.getState().pagination.pageIndex + 1,
    },
  });
};

const nextPage = () => {
  table.nextPage();

  router.push({
    query: {
      ...route.query,
      page: table.getState().pagination.pageIndex + 1,
    },
  });
};

const updateSearch = async (search: string) => {
  if (search == "") {
    const updateQuery = { ...route.query };

    delete updateQuery.search;
    delete updateQuery.page;

    router.push({
      query: updateQuery,
    });

    return;
  }

  router.push({
    query: {
      ...route.query,
      search: search,
      page: 1,
    },
  });
};

const updateCategory = async (categories_id: number) => {
  const updateQuery = { ...route.query };

  delete updateQuery.page;

  if (categories_id == 0) {
    delete updateQuery.categories_id;

    router.push({
      query: updateQuery,
    });
    1;
    return;
  }

  router.push({
    query: {
      ...route.query,
      categories_id: categories_id,
    },
  });
};

const updateType = async (type: Type = "all") => {
  const updateQuery = { ...route.query };

  delete updateQuery.page;

  if (type == "all") {
    delete updateQuery.category_type;

    router.push({
      query: updateQuery,
    });

    return;
  }

  router.push({
    query: {
      ...route.query,
      category_type: type,
    },
  });
};

watch(selectCategory, (newValue: number) => {
  updateCategory(newValue);
});

watch(selectType, (newValue: Type) => {
  updateType(newValue);
});

watch(search, (newValue: string) => {
  updateSearch(newValue);
});

onMounted(async () => {
  await categoryStore.fetchCategories();
  console.log(parseBase64ToHex("6Ugf5fiHosqGxiHbl3ffob9xDRnT77zzjHpEFaEEppk="));
});
</script>
