import { serverURI } from "@/utils/environment";
import axios from "axios";
import { defineStore } from "pinia";

interface Campaign {
  id?: number;
  categories_id: number;
  title: string;
  target: number;
  end_at: Date;
  thumbnail: string;
  campaign_story: string;
  balance: number;
}

const useCampaignStore = defineStore("campaign", {
  state: () => ({
    data: [] as Campaign[],
    rowCount: 0,
  }),
  actions: {
    setCampaign(campaigns: Campaign[], rowCount: number) {
      this.data = campaigns;
      this.rowCount = rowCount;
    },

    async fetchCampaign(page: string, search: string) {
      try {
        const res = await axios.get(
          `${serverURI}/api/campaigns?page=${page}&search=${search}`,
          {
            withCredentials: true,
          }
        );

        const { data } = res.data;
        const { campaigns, rowCount } = data;
        this.setCampaign(campaigns, rowCount);
      } catch (err) {
        throw err;
      }
    },
  },
});

export default useCampaignStore;
