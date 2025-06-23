<template>
  <div class="pt-20 pb-10">
    <div class="container">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">
          Riwayat Pencairan Dana
        </h1>
        <p class="text-gray-600 max-w-md mx-auto">
          Daftar riwayat pencairan dana untuk kampanye ini
        </p>
        <div class="w-16 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <!-- Withdrawal History Cards -->
      <div class="space-y-8" v-if="withdrawStore.data.length > 0">
        <div
          v-for="withdraw in withdrawStore.data"
          :key="withdraw.id"
          class="group relative overflow-hidden"
        >
          <!-- Withdrawal Card -->
          <div
            class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
          >
            <!-- Card Header -->
            <div class="p-6 pb-4 border-b border-gray-100">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h2
                    class="text-xl font-bold text-gray-800 leading-tight hover:text-green-600 transition-colors duration-300 mb-3"
                  >
                    {{ withdraw.title }}
                  </h2>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <div class="flex items-center gap-2">
                      <svg
                        class="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span>{{ dateFormat(withdraw.created_at) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg
                        class="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        ></path>
                      </svg>
                      <span class="font-bold text-green-600"
                        >{{ withdraw.amount }} TON</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 pt-4 relative" v-if="withdraw.body">
              <!-- Content -->
              <div
                v-html="withdraw.body"
                class="prose prose-gray max-w-none leading-relaxed text-gray-700 overflow-hidden transition-all duration-500 ease-in-out withdraw-content"
                :class="
                  expandedId === withdraw.id ? 'max-h-none' : 'max-h-[180px]'
                "
              ></div>

              <!-- Gradient Overlay -->
              <div
                v-show="expandedId !== withdraw.id"
                class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"
              ></div>

              <!-- Expand Button -->
              <div
                v-show="expandedId !== withdraw.id"
                class="absolute bottom-6 left-1/2 transform -translate-x-1/2"
              >
                <button
                  @click="toggleExpanded(withdraw.id)"
                  class="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>Baca </span>
                  <svg
                    class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>

              <!-- Collapse Button -->
              <div
                v-show="expandedId === withdraw.id"
                class="flex justify-center mt-8 pt-6 border-t border-gray-100"
              >
                <button
                  @click="toggleExpanded(withdraw.id)"
                  class="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <svg
                    class="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    ></path>
                  </svg>
                  <span>Tutup</span>
                </button>
              </div>
            </div>
          </div>
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          Belum Ada Pencairan Dana
        </h3>
        <p class="text-gray-500">
          Riwayat pencairan dana akan muncul di sini setelah ada pengajuan
          pencairan
        </p>
      </div>

      <!-- Pagination (jika diperlukan) -->
      <div v-if="withdrawStore.data.length > 0" class="mt-8">
        <Pagination
          v-slot="{ page }"
          :items-per-page="10"
          :total="withdrawStore.rowCount"
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
import useWithdrawStore from "@/stores/withdraw-store";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import router from "@/router";

const route = useRoute();
const withdrawStore = useWithdrawStore();
const campaignId = Number(route.params.id);
const currentPage = ref(1);

// ID withdrawal yang sedang diperluas
const expandedId = ref<number | null>(null);

// Toggle ekspansi (accordion)
function toggleExpanded(id: number) {
  expandedId.value = expandedId.value === id ? null : id;
}

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
  withdrawStore.getWithdraws(campaignId, page);
};

onMounted(async () => {
  await withdrawStore.getWithdraws(campaignId);
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Withdraw content styling */
:deep(.withdraw-content) {
  font-size: 0.95rem;
  line-height: 1.7;
}

:deep(.withdraw-content img) {
  display: block;
  margin: 1.5rem auto;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

:deep(.withdraw-content img:hover) {
  transform: scale(1.02);
}

:deep(.withdraw-content h1),
:deep(.withdraw-content h2),
:deep(.withdraw-content h3) {
  color: #374151;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(.withdraw-content p) {
  margin-bottom: 1rem;
  color: #4b5563;
}

:deep(.withdraw-content a) {
  color: #059669;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

:deep(.withdraw-content a:hover) {
  color: #047857;
  text-decoration: underline;
}

:deep(.withdraw-content ul),
:deep(.withdraw-content ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

:deep(.withdraw-content li) {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

:deep(.withdraw-content blockquote) {
  border-left: 4px solid #10b981;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
  background: #f0fdf4;
  padding: 1rem;
  border-radius: 0 8px 8px 0;
}

/* Animation untuk smooth expand/collapse */
.withdraw-content {
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.group:hover .hover\:shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.withdraw-content) {
    font-size: 0.9rem;
  }
}
</style>
