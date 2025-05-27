import { serverURI } from "@/utils/environment";
import axios from "axios";
import { defineStore } from "pinia";

interface Campaign {
  id?: number;
  categories_id: number;
  title: string;
  target: number;
  balance: number;
  collected: number;
  end_at: Date;
  thumbnail: string | File;
  campaign_story: string;
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

    async getCampaigns(limit: number = 5) {
      try {
        this.isLoading = true;

        const params = new URLSearchParams(window.location.search);

        params.set("limit", limit.toString());

        const res = await axios.get(
          `${serverURI}/api/campaigns?${params.toString()}`
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

    async getCampaign(id: number) {
      try {
        this.isLoading = true;

        const res = await axios.get(`${serverURI}/api/campaigns/id/${id}`);

        const { data } = res.data;
        this.currentCampaign = data;
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

    async updateCampaign(form: FormData) {
      try {
        await axios.put(`${serverURI}/api/campaigns`, form, {
          withCredentials: true,
        });
      } catch (err) {
        throw err;
      }
    },

    async deleteCampaign(id: number) {
      try {
        await axios.delete(`${serverURI}/api/campaigns/id/${id}`);

        this.data = this.data.filter((item: Campaign) => item.id !== id);
      } catch (err) {
        throw err;
      }
    },
  },
});

export default useCampaignStore;
