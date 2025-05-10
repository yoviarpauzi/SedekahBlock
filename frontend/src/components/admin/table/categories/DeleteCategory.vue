<template>
  <AlertDialog v-model:open="isDeleteOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete category
          and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="closeDeleteDialog">Cancel</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
          @click="deleteCategory"
          >Delete</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useCategoryStore from "@/stores/categoryStore";
import { useRoute } from "vue-router";
import { AxiosError } from "axios";
import showToast from "@/utils/showToast";

const props = defineProps<{
  category: {
    id: number;
    name: string;
  };
}>();

const categoryStore = useCategoryStore();

const route = useRoute();

const isDeleteOpen = defineModel<boolean>("isDeleteOpen");

const closeDeleteDialog = () => {
  isDeleteOpen.value = false;
};

const deleteCategory = async () => {
  try {
    closeDeleteDialog();
    const search = route.query.search?.toString() ?? "";
    const page = route.query.page?.toString() ?? "";
    await categoryStore.deleteCategories(props.category.id, search, page);
    showToast("success", "Success", "Category delete successfully");
  } catch (err) {
    let errorMessage = "Failed to delete category";
    if (err instanceof AxiosError && err.response?.data?.error?.issues) {
      errorMessage = err.response.data.error.issues
        .map((e: any) => e.message)
        .join(", ");
    }
    showToast("error", "Error", errorMessage);
  }
};
</script>
