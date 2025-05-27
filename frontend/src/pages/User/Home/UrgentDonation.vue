<template>
  <section class="mt-4">
    <div class="container">
      <h4 class="font-grotesque font-semibold text-2xl text-green-800">
        Penggalangan Dana Mendesak
      </h4>

      <swiper-container
        :slides-per-view="1"
        space-between="16"
        :navigation="false"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }"
        loop="true"
        class="mt-4"
        :breakpoints="{
          '768': {
            slidesPerView: 2,
          },
          '1024': {
            slidesPerView: 4,
          },
        }"
      >
        <swiper-slide
          v-for="item in props.campaigns"
          :key="item.id"
          style="width: auto"
        >
          <CampaignCard :campaign="item" />
        </swiper-slide>
      </swiper-container>
    </div>
  </section>
</template>

<script setup lang="ts">
import CampaignCard from "@/components/CampaignCard.vue";

interface Campaign {
  id: number;
  title: string;
  thumbnail: string;
  balance: number;
  collected: number;
  target: number;
  end_at: Date;
}

const props = defineProps<{
  campaigns: Campaign[];
}>();

console.log(props.campaigns);
</script>
