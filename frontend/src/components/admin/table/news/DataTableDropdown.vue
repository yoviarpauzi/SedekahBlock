<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <RouterLink
        :to="`/admin/campaigns/details/${campaignId}/news/${news.id}/update`"
      >
        <DropdownMenuItem>Update</DropdownMenuItem>
      </RouterLink>
      <DropdownMenuItem @click="deleteNews">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-vue-next";
import { useRoute } from "vue-router";
import showToast from "@/utils/showToast";
import useNewsStore from "@/stores/news-store";

const props = defineProps<{
  news: {
    id: number;
    title: string;
    body: string;
  };
}>();

const route = useRoute();
const campaignId = Number(route.params.id);
const newsStore = useNewsStore();

const deleteNews = async () => {
  try {
    await newsStore.deleteNews(campaignId, props.news.id);
    showToast("success", "success", "success delete news");
  } catch (err: any) {
    showToast("error", "error", "failed delete news");
  }
};
</script>
