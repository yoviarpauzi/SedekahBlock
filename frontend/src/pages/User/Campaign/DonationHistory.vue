<template>
  <div class="pt-20 pb-10">
    <div class="container">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            ></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Riwayat Donasi</h1>
        <p class="text-gray-600 max-w-md mx-auto">
          Daftar orang baik yang telah berdonasi untuk kampanye ini
        </p>
        <div class="w-16 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <!-- Donation History Cards -->
      <div class="space-y-4" v-if="histories.length > 0">
        <div v-for="history in histories" :key="history.id" class="group">
          <a
            :href="`${history.link}`"
            class="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 p-4"
          >
            <div class="flex items-center gap-4">
              <!-- Profile Picture -->
              <div
                class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"
              >
                <img
                  :src="
                    history.users.profile_picture
                      ? history.users.profile_picture.includes('ui-avatars.com')
                        ? history.users.profile_picture
                        : `${serverURI}/${history.users.profile_picture}`
                      : 'https://ui-avatars.com/api/?name=ID'
                  "
                  :alt="history.users.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Donation Info -->
              <div class="flex-1 min-w-0">
                <h3
                  class="font-semibold text-gray-800 group-hover:text-green-600 transition-colors truncate"
                >
                  {{ history.users.name }}
                </h3>
                <p class="text-gray-600 text-sm">
                  Berdonasi sebesar
                  <span class="font-bold text-green-600"
                    >{{ history.amount }} TON</span
                  >
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ dateFormat(history.created_at) }}
                </p>
              </div>

              <!-- Arrow Icon -->
              <div
                class="text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div
          class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          Belum Ada Donasi
        </h3>
        <p class="text-gray-500">
          Riwayat donasi akan muncul di sini setelah ada yang berdonasi
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="histories.length > 0" class="mt-8">
        <Pagination
          v-slot="{ page }"
          :items-per-page="10"
          :total="rowCount"
          :default-page="1"
          :page="currentPage"
          @update:page="updatePage"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>
            </template>

            <PaginationEllipsis :index="4" />

            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { serverURI } from "@/utils/environment";
import axios from "axios";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import router from "@/router";

interface History {
  id: number;
  users_id: number;
  campaigns_id: number;
  description: string;
  link: string;
  amount: string;
  created_at: string;
  users: {
    name: string;
    profile_picture: string;
  };
}

const route = useRoute();
const queryId = Number(route.params.id);
const histories = ref<History[]>([]);
const rowCount = ref(0);
const queryPage = route.query.page ?? "1";
const currentPage = ref(Number(queryPage));

const dateFormat = (date: string): string => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - new Date(date).getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds} detik yang lalu`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} bulan yang lalu`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} tahun yang lalu`;
  }
};

const updatePage = (page: number) => {
  router.push({ query: { ...route.query, page } });
  currentPage.value = page;
};

onMounted(async () => {
  try {
    const response = await axios.get(
      `${serverURI}/api/campaigns/id/${queryId}/histories`
    );

    histories.value = response.data.histories;
    rowCount.value = response.data.rowCount;
  } catch (error) {
    console.error("Error fetching donation history:", error);
  }
});

watch(
  () => currentPage.value,
  async (page) => {
    const response = await axios.get(
      `${serverURI}/api/campaigns/id/${queryId}/histories?page=${page}`
    );

    histories.value = response.data.histories;
    rowCount.value = response.data.rowCount;
  }
);
</script>
