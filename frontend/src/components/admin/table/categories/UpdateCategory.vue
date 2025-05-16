<template>
  <Dialog v-model:open="isUpdateOpen">
    <CategoryForm
      :submit="updateCategory"
      title="Update"
      description="Update category here. Click update when you're done."
      v-model:is-field-dirty="isFieldDirty"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog } from "@/components/ui/dialog";
import showToast from "@/utils/showToast";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";
import useCategoryStore from "@/stores/categoryStore";
import axios, { AxiosError } from "axios";
import { serverURI } from "@/utils/environment";
import CategoryForm from "../../CategoryForm.vue";

const props = defineProps<{
  category: {
    id: number;
    name: string;
  };
}>();

const isUpdateOpen = defineModel<boolean>("isUpdateOpen");

const categoryStore = useCategoryStore();

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
          message: "category name must be unique",
        }
      ),
  })
);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.category.name,
  },
});

const updateCategory = handleSubmit(async (values, { resetForm }) => {
  try {
    closeUpdateDialog();
    await categoryStore.updateCategories(props.category.id, values.name);
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
