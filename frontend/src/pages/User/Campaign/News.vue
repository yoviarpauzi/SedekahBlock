<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-20 pb-16"
  >
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">📰 Kabar Terbaru</h1>
        <p class="text-gray-600 text-lg">
          Dapatkan informasi terkini dan update terbaru
        </p>
        <div
          class="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-4 rounded-full"
        ></div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <div class="h-6 bg-gray-200 rounded-lg mb-4"></div>
            <div class="space-y-3">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-4/5"></div>
              <div class="h-4 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- News Items -->
      <div v-else class="space-y-8">
        <div
          v-for="(newsItem, index) in news.data"
          :key="index"
          class="group relative overflow-hidden"
        >
          <!-- News Card -->
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
                    {{ newsItem.title }}
                  </h2>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
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
                    <span>{{
                      new Date(newsItem.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 pt-4 relative">
              <!-- Content -->
              <div
                v-html="newsItem.body"
                class="prose prose-gray max-w-none leading-relaxed text-gray-700 overflow-hidden transition-all duration-500 ease-in-out news-content"
                :class="
                  expandedId === newsItem.id ? 'max-h-none' : 'max-h-[180px]'
                "
              ></div>

              <!-- Gradient Overlay -->
              <div
                v-show="expandedId !== newsItem.id"
                class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"
              ></div>

              <!-- Expand Button -->
              <div
                v-show="expandedId !== newsItem.id"
                class="absolute bottom-6 left-1/2 transform -translate-x-1/2"
              >
                <button
                  @click="toggleExpanded(newsItem.id)"
                  class="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>Baca Selengkapnya</span>
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
                v-show="expandedId === newsItem.id"
                class="flex justify-center mt-8 pt-6 border-t border-gray-100"
              >
                <button
                  @click="toggleExpanded(newsItem.id)"
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

        <!-- Empty State -->
        <div v-if="news.data.length === 0" class="text-center py-16">
          <div
            class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            Belum Ada Berita
          </h3>
          <p class="text-gray-500">Berita terbaru akan muncul di sini</p>
        </div>
      </div>

      <!-- Stats Footer -->
      <div v-if="news.data.length > 0" class="mt-16 text-center">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md"
        >
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span class="text-sm text-gray-600">
            {{ news.rowCount }} berita tersedia
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { serverURI } from "@/utils/environment";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

interface News {
  id: number;
  title: string;
  body: string;
  created_at: string;
}

const route = useRoute();
const campaignId = route.params.id;

const news = ref<{
  data: News[];
  rowCount: number;
}>({
  data: [],
  rowCount: 0,
});

// Loading state
const loading = ref(true);

// ID berita yang sedang diperluas
const expandedId = ref<number | null>(null);

// Toggle ekspansi (accordion)
function toggleExpanded(id: number) {
  expandedId.value = expandedId.value === id ? null : id;
}

onMounted(async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `${serverURI}/api/campaigns/id/${campaignId}/news`
    );

    news.value.data = response.data.news;
    news.value.rowCount = response.data.rowCount;
  } catch (error) {
    console.error("Error fetching news:", error);
  } finally {
    loading.value = false;
  }
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

/* News content styling */
:deep(.news-content) {
  font-size: 0.95rem;
  line-height: 1.7;
}

:deep(.news-content img) {
  display: block;
  margin: 1.5rem auto;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

:deep(.news-content img:hover) {
  transform: scale(1.02);
}

:deep(.news-content h1),
:deep(.news-content h2),
:deep(.news-content h3) {
  color: #374151;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(.news-content p) {
  margin-bottom: 1rem;
  color: #4b5563;
}

:deep(.news-content a) {
  color: #059669;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

:deep(.news-content a:hover) {
  color: #047857;
  text-decoration: underline;
}

:deep(.news-content ul),
:deep(.news-content ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

:deep(.news-content li) {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

:deep(.news-content blockquote) {
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
.news-content {
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.group:hover .group-hover\:shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.news-content) {
    font-size: 0.9rem;
  }

  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
