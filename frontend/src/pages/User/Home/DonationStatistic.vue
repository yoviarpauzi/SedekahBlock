<template>
  <div
    class="bg-gradient-to-r from-green-600 to-green-800 py-10 overflow-hidden"
  >
    <div class="container">
      <!-- Header Section -->
      <div class="text-center mb-10">
        <h2
          class="font-jakarta text-xl lg:text-3xl font-semibold text-white drop-shadow-lg"
        >
          Mari saling membantu
        </h2>
        <p
          class="text-gray-100 mt-2 font-grotesque text-lg lg:text-xl font-semibold"
        >
          Bersama-sama, kita dapat memberikan dampak yang positif bagi mereka
          yang membutuhkan.
        </p>
      </div>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(item, idx) in stats"
          :key="idx"
          class="font-poppins bg-white/10 backdrop-blur-md rounded-lg p-6 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          <p class="text-xl lg:text-2xl text-white drop-shadow-md font-medium">
            {{ item.value }}
          </p>
          <p class="text-gray-100 mt-2 text-sm lg:text-base">
            {{ item.label }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface StatItem {
  value: number | string;
  label: string;
}

const props = defineProps<{
  stats: {
    activeDonation: number;
    donationDistributed: number;
  };
}>();

const stats = computed<StatItem[]>(() => [
  { value: props?.stats?.activeDonation ?? 0, label: "Donasi Aktif" },
  {
    value: props?.stats?.donationDistributed ?? 0,
    label: "Donasi Tersalurkan",
  },
]);
</script>
