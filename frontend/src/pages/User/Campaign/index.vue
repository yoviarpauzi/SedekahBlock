<template>
  <Feature
    v-model:campaign-search="campaignSearch"
    v-model:campaign-category="campaignCategory"
    v-model:campaign-status="campaignStatus"
    @search="onSearch"
  />
</template>

<script setup lang="ts">
import Feature from "@/pages/User/Campaign/Feature.vue";
import { ref } from "vue";

const campaignSearch = ref("");
const campaignCategory = ref("all");
const campaignStatus = ref("all");

const onSearch = () => {};
</script>
