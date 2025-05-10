<template>
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Create Campaign</h2>
  <form class="space-y-6" @submit="createCampaign">
    <!-- title -->
    <FormField
      v-slot="{ componentField }"
      name="title"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Title<span class="text-red-400">*</span></FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Peduli Panti Jompo..."
            class="selection:bg-gray-300 selection:text-black"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- categories_id -->
    <FormField
      v-slot="{ componentField }"
      name="categories_id"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Category<span class="text-red-400">*</span></FormLabel>

        <Select v-bind="componentField">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem
                v-for="item in categoryStore.data"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>

        <FormMessage />
      </FormItem>
    </FormField>

    <!-- target -->
    <FormField
      v-slot="{ componentField }"
      name="target"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Target <span class="text-red-400">*</span></FormLabel>
        <FormControl>
          <Input
            type="number"
            placeholder="1.00"
            class="selection:bg-gray-300 selection:text-black"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription
          >Sama Dengan :
          {{
            totalTargetPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })
          }}</FormDescription
        >
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ componentField }"
      name="campaign_story"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Campaign Story</FormLabel>
        <FormControl> </FormControl>
      </FormItem>
    </FormField>
  </form>
</template>

<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";
import { useForm } from "vee-validate";
import Input from "@/components/ui/input/Input.vue";
import useCategoryStore from "@/stores/categoryStore";
import axios from "axios";
import { serverURI } from "@/utils/environment";
import FormDescription from "@/components/ui/form/FormDescription.vue";
import { ref, onMounted, computed } from "vue";
import getTonPrice from "@/utils/checkTonPrice";

const tonPrice = ref<number>(0);

const formSchema = toTypedSchema(
  z.object({
    title: z
      .string()
      .max(100)
      .refine(
        async (title) => {
          const res = await axios.get(
            `${serverURI}/api/campaigns/check?title=${title}`
          );
          const { data } = res.data;
          return !data;
        },
        {
          message: "campaign title is already exists",
        }
      ),
    categories_id: z.number(),
    target: z.number(),
  })
);

const { isFieldDirty, handleSubmit, values } = useForm({
  validationSchema: formSchema,
});

const totalTargetPrice = computed(() => {
  return (tonPrice.value || 0) * (values.target || 0);
});

const categoryStore = useCategoryStore();

onMounted(async () => {
  await categoryStore.fetchCategories();
  tonPrice.value = await getTonPrice();
});

const createCampaign = async () => {};
</script>
