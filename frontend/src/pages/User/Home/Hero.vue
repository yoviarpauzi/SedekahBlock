<template>
  <section class="flex items-center pt-24 pb-16 md:pt-26 overflow-x-hidden">
    <div class="container">
      <div
        class="grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-20 w-full"
      >
        <!-- Hero Left -->
        <div class="header-left">
          <h4
            class="text-2xl lg:text-4xl font-bold text-green-800 font-jakarta"
          >
            Sedekah<span class="text-green-600">Block</span>
          </h4>
          <p class="text-gray-700 mt-4 font-grotesque text-xl font-medium">
            <span class="text-green-800 font-semibold">Sedekah</span>
            <span class="text-green-600 font-semibold">Block</span> adalah
            platform donasi berbasis teknologi blockchain TON yang dikelola oleh
            Yayasan Pribumi untuk Negeri. Yayasan kami menghadirkan sistem
            donasi yang
            <span class="font-semibold text-green-600 tracking-wide"
              >transparan, aman, dan terpercaya</span
            >
            untuk membantu sesama dengan lebih mudah.
          </p>
          <RouterLink to="/campaigns">
            <Button class="mt-6 font-jakarta" variant="success" size="lg">
              Donasi Yuk
            </Button>
          </RouterLink>
        </div>

        <!-- Hero Right -->
        <div class="flex justify-center items-center header-right">
          <img
            src="@/assets/images/hero_image.png"
            alt="hero image"
            class="h-auto max-w-full md:max-w-80 xl:max-w-lg 2xl:max-w-xl"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
</script>
