import axios from "axios";
import { serverURI } from "@/utils/environment";
import { defineStore } from "pinia";

interface Transfer {
  id: number;
  campaigns_id: number;
  receiver_campaign_id: number;
  amount: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

const useTransferStore = defineStore("transfer", {
  state: () => ({
    data: [] as Transfer[],
    rowCount: 0,
    isLoading: false,
  }),

  actions: {
    setTransfer(data: Transfer[], rowCount: number) {
      this.data = data;
      this.rowCount = rowCount;
    },

    async getTransfers(campaignId: number) {
      try {
        this.isLoading = true;
        const res = await axios.get(
          `${serverURI}/api/campaigns/id/${campaignId}/transfers`,
          {
            withCredentials: true,
          }
        );

        this.setTransfer(res.data.transfers, res.data.rowCount);
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async createTransfer(
      campaignId: number,
      receiver_campaign_id: number,
      amount: number
    ) {
      this.isLoading = true;
      try {
        await axios.post(
          `${serverURI}/api/campaigns/id/${campaignId}/transfer`,
          {
            receiver_campaign_id: receiver_campaign_id,
            amount: amount,
          },
          {
            withCredentials: true,
          }
        );

        await this.getTransfers(campaignId);
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});

export default useTransferStore;
