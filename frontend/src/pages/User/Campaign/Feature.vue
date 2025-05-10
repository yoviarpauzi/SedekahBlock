<template>
  <div class="container pt-20 pb-10">
    <div class="flex flex-col gap-4 md:flex-row">
      <div class="flex items-center gap-x-2 md:w-96">
        <Input placeholder="Cari Kampanye..." v-model="campaignSearch" />
      </div>

      <div class="flex items-center gap-x-4">
        <!-- Select for Kategori -->
        <Select v-model="campaignCategory">
          <SelectTrigger>
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Kategori</SelectLabel>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="natural_disasters">Bencana Alam</SelectItem>
              <SelectItem value="education">Bantuan Pendidikan</SelectItem>
              <SelectItem value="humanity">Kemanusiaan</SelectItem>
              <SelectItem value="social_activities">Kegiatan Sosial</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <!-- Select for Status -->
        <Select v-model="campaignStatus">
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="disaster">Berlangsung</SelectItem>
              <SelectItem value="education">Selesai</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";

defineEmits<{
  (e: "search"): void;
}>();

const campaignSearch = defineModel<string>("campaignSearch", {
  default: "",
});
const campaignCategory = defineModel<string>("campaignCategory", {
  default: "all",
});
const campaignStatus = defineModel<string>("campaignStatus", {
  default: "all",
});
</script>
