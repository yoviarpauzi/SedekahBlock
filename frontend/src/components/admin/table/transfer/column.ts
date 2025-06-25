import { type ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { serverURI } from "@/utils/environment";
import axios from "axios";

interface Transfer {
  id: number;
  campaigns_id: number;
  receiver_campaign_id: number;
  amount: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

const result = await axios.get(`${serverURI}/api/campaigns/getActives`);
const campaigns = result.data.campaigns;

const campaignMap = Object.fromEntries(
  campaigns.map((cam: { id: number; title: string }) => [cam.id, cam.title])
);

export const columns: ColumnDef<Transfer>[] = [
  {
    accessorKey: "receiver_campaign_id",
    header: () => "Receiver Campaign ID",
  },
  {
    accessorKey: "receiver_campaign_id",
    header: () => "Receiver Campaign Name",
    cell: ({ row }) => {
      const receiver_campaign_id: number = row.getValue("receiver_campaign_id");
      const campaignName = campaignMap[receiver_campaign_id];
      return h("div", { class: "text-left" }, campaignName);
    },
  },
  {
    accessorKey: "amount",
    header: () => "Amount",
    cell: ({ row }) => {
      const formatted: string = row.getValue("amount") + " TON";
      return h("div", { class: "text-left " }, formatted);
    },
  },
];
