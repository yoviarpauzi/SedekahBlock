<template>
  <Header />
  <div class="py-20">
    <RouterView />
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { RouterView } from "vue-router";
</script>
