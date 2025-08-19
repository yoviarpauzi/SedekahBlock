<template>
  <form class="space-y-6" @submit.prevent="submit">
    <FormField
      v-slot="{ componentField }"
      name="amount"
      :validate-on-blur="!isFieldDirty('amount')"
      v-if="route.path.includes('/create')"
    >
      <FormItem>
        <FormLabel for="amount"
          >Amount<span class="text-red-400">*</span></FormLabel
        >
        <FormControl>
          <div class="relative w-full">
            <Input
              type="number"
              step="0.01"
              min="0"
              class="w-full !pr-14 !pl-4 !py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 no-spinner selection:bg-gray-300 selection:text-black"
              v-bind="componentField"
              @input="onInputChange('amount', $event.target.value)"
              :value="values.amount || ''"
            />
             <span
              class="absolute inset-y-0 right-4 flex items-center text-gray-500 text-sm pointer-events-none"
            >
              TON
            </span>
          </div>
        </FormControl>
        <FormDescription>
          Sama Dengan :
          {{ totalTargetPrice }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ componentField }"
      name="title"
      :validate-on-blur="!isFieldDirty('title')"
    >
      <FormItem>
        <FormLabel for="title"
          >Title<span class="text-red-400">*</span></FormLabel
        >
        <FormControl>
          <Input
            type="text"
            placeholder="Peduli Panti Jompo..."
            class="selection:bg-gray-300 selection:text-black"
            v-bind="componentField"
            @input="onInputChange('title', $event.target.value)"
            :value="values.title || ''"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="body">
      <FormItem>
        <FormLabel>Body<span class="text-red-400">*</span></FormLabel>
        <FormControl>
          <QuillEditor
            theme="snow"
            contentType="html"
            :content="values.body || ''"
            @update:content="(val: string) => onInputChange('body', val)"
            style="height: 25rem"
            class="border"
            :toolbar="toolbarOptions"
            :modules="modules"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button variant="success" type="submit" class="font-poppins">
      {{ action }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import BlotFormatter from "quill-blot-formatter";
// @ts-ignore
import ImageUploader from "quill-image-uploader";
import axios from "axios";
import { serverURI } from "@/utils/environment";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input/Input.vue";
import { QuillEditor } from "@vueup/vue-quill";
import { useRoute } from "vue-router";
import {ref, computed, onMounted} from "vue";
import getTonPrice from "@/utils/checkTonPrice";

const route = useRoute();
const tonPrice = ref<number>(0);
const props = defineProps<{
  values: any;
  setFieldValue: Function;
  submit: () => void;
  action: string;
  isFieldDirty: Function;
}>();

const toolbarOptions = [
  { header: [1, 2, 3, false] },
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  { list: "ordered" },
  { list: "bullet" },
  { script: "sub" },
  { script: "super" },
  { indent: "-1" },
  { indent: "+1" },
  "link",
  "image",
];

const modules = [
  {
    name: "blotFormatter",
    module: BlotFormatter,
  },
  {
    name: "imageUploader",
    module: ImageUploader,
    options: {
      upload: (file: File) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("content", file);
          axios
            .post(
              `${serverURI}/api/campaigns/withdraw/upload-content`,
              formData,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              resolve(res.data.url);
            })
            .catch(() => {
              reject("Upload failed");
            });
        });
      },
    },
  },
];

const onInputChange = (field: any, value: string | number) => {
  if (field === "amount") value = Number(value);
  props.setFieldValue(field, value);
};

const totalTargetPrice = computed(() => {
  return (tonPrice.value * (props.values.amount ?? 0)).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
});

onMounted(async () => {
  tonPrice.value = await getTonPrice();
});
</script>
