<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <RouterLink :to="`/admin/campaigns/details/${campaign.id}`">
          <DropdownMenuItem>Detail</DropdownMenuItem>
        </RouterLink>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
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

defineProps<{
  campaign: {
    id: number;
    categories_id: number;
    title: string;
    target: number;
    end_at: Date;
    balance: number;
  };
}>();
</script>
