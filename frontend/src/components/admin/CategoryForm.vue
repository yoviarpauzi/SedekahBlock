<template>
  <DialogContent class="sm:max-w-[425px]">
    <DialogHeader class="font-poppins">
      <DialogTitle>{{ props.title }} Category</DialogTitle>
      <DialogDescription>
        {{ props.description }}
      </DialogDescription>
    </DialogHeader>
    <form @submit.prevent="props.submit">
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
        <DialogClose as-child>
          <Button variant="outline" type="button">Cancel</Button>
        </DialogClose>
        <Button variant="success" type="submit" class="font-poppins">
          {{ props.title }}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</template>

<script setup lang="ts">
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Input from "../ui/input/Input.vue";
import Button from "../ui/button/Button.vue";

const props = defineProps<{
  submit: () => {};
  isFieldDirty: <TPath extends "name">(path: TPath) => boolean;
  title: string;
  description: string;
}>();
</script>
