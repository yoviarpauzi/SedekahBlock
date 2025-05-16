<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="success">Create</Button>
    </DialogTrigger>
    <CategoryForm
      :submit="createCategory"
      title="Create"
      description=" Create a new category here. Click create when you're done."
      :is-field-dirty="isFieldDirty"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Button from "@/components/ui/button/Button.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";
import useCategoryStore from "@/stores/categoryStore";
import axios from "axios";
import { serverURI } from "@/utils/environment";
import showToast from "@/utils/showToast";
import CategoryForm from "../../CategoryForm.vue";

const categoryStore = useCategoryStore();

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .max(100)
      .refine(
        async (name) => {
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
});

const createCategory = handleSubmit(async (values, { resetForm }) => {
  try {
    await categoryStore.addCategories(values.name);
    showToast("success", "Success", "Category created successfully");
    resetForm();
  } catch (err) {
    let errorMessage = "Failed to create category";
    showToast("error", "Error", errorMessage);
  }
});
</script>
