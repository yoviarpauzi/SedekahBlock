<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="success">Create</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader class="font-poppins">
        <DialogTitle>Create Category</DialogTitle>
        <DialogDescription>
          Create a new category here. Click create when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="createCategory">
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
                class="col-span-3 selection:bg-green-100 selection:text-black font-poppins"
                placeholder="Enter category name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <DialogFooter class="mt-4">
          <DialogClose as-child>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button variant="success" type="submit" class="font-poppins">
            Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
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
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";
import useCategoryStore from "@/stores/categoryStore";
import axios, { AxiosError } from "axios";
import { serverURI } from "@/utils/environment";
import { useRouter } from "vue-router";
import showToast from "@/utils/showToast";

const categoryStore = useCategoryStore();
const router = useRouter();

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
          message: "Campaign name must be unique",
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
    router.push({ query: { page: "1" } });
  } catch (err) {
    let errorMessage = "Failed to create category";
    if (err instanceof AxiosError && err.response?.data?.error?.issues) {
      errorMessage = err.response.data.error.issues
        .map((e: any) => e.message)
        .join(", ");
    }
    showToast("error", "Error", errorMessage);
  }
});
</script>
