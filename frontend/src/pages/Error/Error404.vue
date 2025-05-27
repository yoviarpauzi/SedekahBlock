<template>
  <div class="container">
    <div
      class="flex flex-col items-center justify-center min-h-screen text-gray-800"
    >
      <h1 class="text-6xl font-bold mb-4">404</h1>
      <p class="mb-6 text-center text-gray-500">Halaman tidak ditemukan.</p>
      <RouterLink to="/">
        <Button variant="success"> Kembali ke Beranda </Button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
</script>
