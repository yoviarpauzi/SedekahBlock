<template>
  <form class="space-y-6" @submit.prevent="submit">
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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input/Input.vue";
import { QuillEditor } from "@vueup/vue-quill";

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
            .post(`${serverURI}/api/campaigns/news/upload-content`, formData, {
              withCredentials: true,
            })
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

const onInputChange = (field: any, value: any) => {
  props.setFieldValue(field, value);
};
</script>
