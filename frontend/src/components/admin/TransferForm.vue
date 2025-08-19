<template>
  <form class="space-y-6" @submit.prevent="submit">
    <FormField
      v-slot="{ componentField }"
      name="receiver_campaign_id"
      :validate-on-blur="!isFieldDirty('receiver_campaign_id')"
    >
      <FormItem>
        <FormLabel>Receiver Campaign</FormLabel>

        <Select v-bind="componentField" @change="onCampaignChange">
          <FormControl>
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select receiver campaign" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="campaign in campaigns"
                :value="campaign.id"
                :key="campaign.id"
              >
                {{ campaign.title }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      name="amount"
      v-slot="{ componentField }"
      :validate-on-blur="!isFieldDirty('amount')"
    >
      <FormItem>
        <FormLabel
          >Jumlah Transfer<span class="text-red-400">*</span></FormLabel
        >
        <FormControl>
          <div class="relative w-full">
            <Input
              type="number"
              placeholder="0"
              step="0.01"
              class="w-full !pr-14 !pl-4 !py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 no-spinner selection:bg-gray-300 selection:text-black"
              v-bind="componentField"
              @input="onInputChange('title', $event.target.value)"
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
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input/Input.vue";
import axios from "axios";
import { serverURI } from "@/utils/environment";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import getTonPrice from "@/utils/checkTonPrice";

const tonPrice = ref<number>(0);
const props = defineProps<{
  values: any;
  setFieldValue: Function;
  submit: () => void;
  action: string;
  isFieldDirty: Function;
}>();

interface Campaign {
  id: number;
  title: string;
}

const campaigns = ref<Campaign[]>([]);
const route = useRoute();
const campaignId = Number(route.params.id);

const onInputChange = (field: any, value: any) => {
  props.setFieldValue(field, value);
};

const onCampaignChange = (value: number) => {
  if (value !== null) {
    props.setFieldValue("receiver_campaign_id", value);
  }
};

onMounted(async () => {
  tonPrice.value = await getTonPrice();
  const res = await axios.get(`${serverURI}/api/campaigns/getActives`);
  campaigns.value = res.data.campaigns;
  campaigns.value = campaigns.value.filter(
    (campaign) => campaign.id !== campaignId
  );
});

const totalTargetPrice = computed(() => {
  return (tonPrice.value * (props.values.amount ?? 0)).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
});
</script>
