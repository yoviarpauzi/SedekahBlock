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
        <DropdownMenuItem @click="openUpdateDialog"> Update </DropdownMenuItem>
        <DropdownMenuItem @click="openDeleteDialog">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <UpdateCategory
      :category="category"
      v-model:is-update-open="isUpdateOpen"
    />
    <DeleteCategory
      :category="category"
      v-model:is-delete-open="isDeleteOpen"
    />
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
import { ref } from "vue";
import UpdateCategory from "./UpdateCategory.vue";
import DeleteCategory from "./DeleteCategory.vue";

defineProps<{
  category: {
    id: number;
    name: string;
  };
}>();

const isUpdateOpen = ref<boolean>(false);
const isDeleteOpen = ref<boolean>(false);

function openUpdateDialog() {
  isUpdateOpen.value = true;
}

function openDeleteDialog() {
  isDeleteOpen.value = true;
}
</script>
