<template>
  <div class="container pt-20">
    <div class="flex flex-col gap-4 md:flex-row">
      <div class="flex items-center gap-x-2 md:w-96">
        <Input
          placeholder="Cari Kampanye..."
          v-model="campaignSearch"
          class="selection:bg-gray-400"
        />
      </div>

      <div class="flex items-center gap-x-4">
        <!-- Select for Kategori -->
        <Select v-model="campaignCategory">
          <SelectTrigger>
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Kategori</SelectLabel>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem
                v-for="item in categoryStore.data"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>

        <!-- Select for Status -->
        <Select v-model="campaignStatus">
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="ongoing">Berlangsung</SelectItem>
              <SelectItem value="conclude">Berakhir</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import useCategoryStore from "@/stores/category-store";
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();

const campaignSearch = defineModel<string>("campaignSearch", {
  default: "",
});

const campaignCategory = defineModel<string>("campaignCategory");

const campaignStatus = defineModel<string>("campaignStatus");

onMounted(async () => {
  await categoryStore.fetchCategories();
});

watch(
  () => campaignSearch.value,
  (value) => {
    const query = { ...route.query };

    if (value === "") {
      delete query.search;
      delete query.page;
      router.replace({ query });
      return;
    }

    router.replace({
      query: {
        ...route.query,
        search: value,
      },
    });
  }
);

watch(
  () => campaignCategory.value,
  (value) => {
    const query = { ...route.query };

    delete query.page;

    if (value === "all") {
      delete query.categories_id;
      router.replace({ query });
      return;
    }

    router.replace({
      query: {
        ...route.query,
        categories_id: value,
      },
    });
  }
);

watch(
  () => campaignStatus.value,
  (value) => {
    const query = { ...route.query };

    delete query.page;

    if (value === "all") {
      delete query.category_type;
      router.replace({ query });
      return;
    }

    router.replace({
      query: {
        ...route.query,
        category_type: value,
      },
    });
  }
);
</script>
