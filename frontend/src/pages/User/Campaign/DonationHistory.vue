<template>
  <div class="pt-20 pb-10">
    <div class="container">
      <p class="text-xl font-semibold">Riwayat Donasi</p>

      <div class="grid gap-y-4 mt-4">
        <div
          v-if="histories.length > 0"
          v-for="history in histories"
          :key="history.id"
        >
          <a
            :href="`${history.link}`"
            class="p-2 bg-gray-50 shadow-sm rounded-md flex items-center gap-x-4"
          >
            <div class="w-11 rounded-full">
              <img
                :src="history.users.profile_picture"
                alt="profile"
                class="w-full h-full object-cover rounded-full"
              />
            </div>

            <div>
              <p class="font-medium">{{ history.users.name }}</p>
              <p>
                Berdonasi sebesar
                <span class="font-semibold">{{ history.amount }} TON</span>
              </p>
              <p class="text-xs">{{ dateFormat(history.created_at) }}</p>
            </div>
          </a>
        </div>

        <div
          v-else
          class="h-32 flex items-center justify-center text-center text-gray-500"
        >
          <p class="text-sm">Riwayat donasi tidak ditemukan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { serverURI } from "@/utils/environment";
import axios from "axios";
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";

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

const dateFormat = (date: string): string => {
  const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" }); // Bahasa Indonesia
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  const divisions = [
    { amount: 60, name: "second" },
    { amount: 60, name: "minute" },
    { amount: 60, name: "hour" },
    { amount: 24, name: "day" },
    { amount: 30, name: "month" },
    { amount: 12, name: "year" },
  ];

  let duration = diffInSeconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      break;
    }
    duration = Math.floor(duration / division.amount);
    unit = division.name as Intl.RelativeTimeFormatUnit;
  }

  return rtf.format(-duration, unit); // pakai minus karena kita bicara "yang lalu"
};

onMounted(async () => {
  const response = await axios.get(
    `${serverURI}/api/campaigns/id/${queryId}/histories`
  );

  histories.value = response.data.histories;
  console.log(histories.value);
});
</script>
