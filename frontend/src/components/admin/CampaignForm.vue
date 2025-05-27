<template>
  <form
    class="space-y-6"
    @submit.prevent="submit"
    enctype="multipart/form-data"
  >
    <!-- thumbnail -->
    <FormField name="thumbnail">
      <FormItem>
        <FormLabel>Thumbnail<span class="text-red-400">*</span></FormLabel>
        <FormControl>
          <Input type="file" @change="onFileChange" name="content" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- title -->
    <FormField
      v-slot="{ componentField }"
      name="title"
      :validate-on-blur="!isFieldDirty('title')"
    >
      <FormItem>
        <FormLabel>Title<span class="text-red-400">*</span></FormLabel>
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

    <!-- categories_id -->
    <FormField
      v-slot="{ componentField }"
      name="categories_id"
      :validate-on-blur="!isFieldDirty('categories_id')"
    >
      <FormItem>
        <FormLabel>Category<span class="text-red-400">*</span></FormLabel>
        <Select
          v-bind="componentField"
          @change="onInputChange('categories_id', $event)"
          :value="values.categories_id"
        >
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
              >
                {{ item.name }}
              </SelectItem>
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
      :validate-on-blur="!isFieldDirty('target')"
    >
      <FormItem>
        <FormLabel>Target <span class="text-red-400">*</span></FormLabel>
        <FormControl>
          <Input
            type="number"
            placeholder="1.00"
            class="selection:bg-gray-300 selection:text-black"
            v-bind="componentField"
            step="0.01"
            @input="onInputChange('target', parseFloat($event.target.value))"
            :value="values.target"
          />
        </FormControl>
        <FormDescription>
          Sama Dengan :
          {{
            totalTargetPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })
          }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- end_at -->
    <FormField name="end_at">
      <FormItem class="flex flex-col">
        <FormLabel>End At <span class="text-red-400">*</span></FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                :class="
                  cn(
                    'text-start font-normal',
                    !dateValue && 'text-muted-foreground'
                  )
                "
              >
                <span>{{
                  dateValue ? df.format(toDate(dateValue)) : "Pick a date"
                }}</span>
                <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
              </Button>
              <input hidden />
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar
              v-model="dateValue"
              calendar-label="Date of birth"
              initial-focus
              :min-value="today(getLocalTimeZone())"
              class="font-poppins"
              @update:model-value="onDateChange"
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- campaign_story -->
    <FormField name="campaign_story">
      <FormItem>
        <FormLabel
          >Campaign Story <span class="text-red-400">*</span></FormLabel
        >
        <FormControl>
          <QuillEditor
            theme="snow"
            contentType="html"
            :content="values.campaign_story || ''"
            @update:content="(val: string) => onInputChange('campaign_story', val)"
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input/Input.vue";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
import { toDate } from "reka-ui/date";
import { ref, computed, onMounted } from "vue";
import { cn } from "@/lib/utils";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import BlotFormatter from "quill-blot-formatter";
import ImageUploader from "quill-image-uploader";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
import useCategoryStore from "@/stores/categoryStore";
import axios from "axios";
import getTonPrice from "@/utils/checkTonPrice";
import { serverURI } from "@/utils/environment";

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
            .post(`${serverURI}/api/campaigns/upload-content`, formData, {
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

const categoryStore = useCategoryStore();

const df = new DateFormatter("id-ID", {
  dateStyle: "long",
});

const dateValue = computed({
  get: () => (props.values.end_at ? parseDate(props.values.end_at) : undefined),
  set: (val) => {
    if (val) {
      props.setFieldValue("end_at", val.toString());
    } else {
      props.setFieldValue("end_at", undefined);
    }
  },
});

function onDateChange(val: any) {
  if (val) {
    props.setFieldValue("end_at", val.toString());
  } else {
    props.setFieldValue("end_at", undefined);
  }
}

const tonPrice = ref<number>(0);

const totalTargetPrice = computed(() => {
  return tonPrice.value * (props.values.target ?? 0);
});

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    props.setFieldValue("thumbnail", input.files[0]);
  }
}

function onInputChange(field: any, value: any) {
  props.setFieldValue(field, value);
}

onMounted(async () => {
  await categoryStore.fetchCategories();
  tonPrice.value = await getTonPrice();
});
</script>
