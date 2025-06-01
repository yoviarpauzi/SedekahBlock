<template>
  <section class="mt-4 mb-8">
    <div class="container">
      <h4 class="font-grotesque font-semibold text-2xl text-green-800">
        Pilihan Yayasan
      </h4>

      <swiper-container
        :slides-per-view="1"
        space-between="16"
        :navigation="false"
        loop="true"
        class="mt-4"
        :autoplay="{
          delay: 3000,
        }"
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
  collected: number;
  balance: number;
  target: number;
  end_at: Date;
}

const props = defineProps<{
  campaigns: Campaign[];
}>();
</script>
