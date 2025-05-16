import { serverURI } from "@/utils/environment";
import axios from "axios";
import { defineStore } from "pinia";

interface Campaign {
  id?: number;
  categories_id: number;
  title: string;
  target: number;
  end_at: Date;
  thumbnail: string | File;
  campaign_story: string;
  balance?: number;
}

const useCampaignStore = defineStore("campaign", {
  state: () => ({
    data: [] as Campaign[],
    currentCampaign: {} as Campaign,
    rowCount: 0,
    isLoading: false,
  }),
  actions: {
    setCampaign(campaigns: Campaign[], rowCount: number) {
      this.data = campaigns;
      this.rowCount = rowCount;
    },

    async getCampaigns(page: number = 1, search: string = "") {
      try {
        this.isLoading = true;

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
      } finally {
        this.isLoading = false;
      }
    },

    async addCampaign(form: FormData) {
      try {
        await axios.post(`${serverURI}/api/campaigns`, form, {
          withCredentials: true,
        });
      } catch (err) {
        throw err;
      }
    },
  },
});

export default useCampaignStore;
