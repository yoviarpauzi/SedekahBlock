<template>
  <Hero />
  <DonationStatistic
    v-if="fetchHomeData"
    :stats="fetchHomeData?.donationStatistic"
  />
  <UrgentDonation
    v-if="fetchHomeData"
    :campaigns="fetchHomeData?.urgentFundraising"
  />
  <FoundationChoice
    v-if="fetchHomeData"
    :campaigns="fetchHomeData?.foundationChoice"
  />

  <div
    class="bg-gradient-to-r from-green-600 to-green-800 py-16 px-4 text-center"
  >
    <h4 class="text-white text-xl lg:text-3xl font-bold mb-2 font-jakarta">
      Ayo Donasi!
    </h4>
    <p class="text-white font-medium mb-8 font-jakarta">
      Satu Donasi Kecil Bisa Membantu Hidup Seseorang
    </p>
    <RouterLink to="/campaigns">
      <Button
        class="bg-white text-green-700 font-bold px-6 py-3 rounded-full hover:bg-green-100 transition duration-300 font-jakarta"
      >
        Donasi Sekarang!
      </Button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import Hero from "@/pages/User/Home/Hero.vue";
import UrgentDonation from "@/pages/User/Home/UrgentDonation.vue";
import FoundationChoice from "@/pages/User/Home/FoundationChoice.vue";
import DonationStatistic from "@/pages/User/Home/DonationStatistic.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import { serverURI } from "@/utils/environment";
import Button from "@/components/ui/button/Button.vue";

const fetchHomeData = ref();

onMounted(async () => {
  const res = await axios.get(`${serverURI}/api/home`);

  const { data } = res.data;
  fetchHomeData.value = data;
});
</script>
