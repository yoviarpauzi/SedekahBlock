<template>
  <Dialog v-model:open="isUpdateOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader class="font-poppins">
        <DialogTitle>Update Category</DialogTitle>
        <DialogDescription>
          Update category here. Click update when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="updateCategory">
        <FormField
          v-slot="{ componentField }"
          name="name"
          :validate-on-blur="!isFieldDirty"
        >
          <FormItem>
            <FormLabel class="mb-2">Name</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                id="name"
                class="col-span-3 selection:bg-gray-200 selection:text-black font-poppins"
                placeholder="Enter category name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <DialogFooter class="mt-4">
          <Button
            variant="outline"
            type="button"
            @click.prevent="closeUpdateDialog"
            >Cancel</Button
          >
          <Button variant="success" type="submit" class="font-poppins">
            Update
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import showToast from "@/utils/showToast";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";
import useCategoryStore from "@/stores/categoryStore";
import axios, { AxiosError } from "axios";
import { serverURI } from "@/utils/environment";
import { useRoute } from "vue-router";

const props = defineProps<{
  category: {
    id: number;
    name: string;
  };
}>();

const isUpdateOpen = defineModel<boolean>("isUpdateOpen");

const categoryStore = useCategoryStore();

const route = useRoute();

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .max(100)
      .refine(
        async (name: string) => {
          const res = await axios.get(
            `${serverURI}/api/categories/check?name=${name}`,
            {
              withCredentials: true,
            }
          );

          const { data } = res.data;
          return !data;
        },
        {
          message: "Campaign name must be unique",
        }
      ),
  })
);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
});

const updateCategory = handleSubmit(async (values, { resetForm }) => {
  try {
    closeUpdateDialog();
    const search: string = route.query.search?.toString() ?? "";
    const page: string = route.query.page?.toString() ?? "";
    await categoryStore.updateCategories(
      props.category.id,
      values.name,
      search,
      page
    );
    showToast("success", "Success", "Category update successfully");
    resetForm();
  } catch (err) {
    let errorMessage = "Failed to update category";
    if (err instanceof AxiosError && err.response?.data?.error?.issues) {
      errorMessage = err.response.data.error.issues
        .map((e: any) => e.message)
        .join(", ");
    }
    showToast("error", "Error", errorMessage);
  }
});

const closeUpdateDialog = () => {
  isUpdateOpen.value = false;
};
</script>
