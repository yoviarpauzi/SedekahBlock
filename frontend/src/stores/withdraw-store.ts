import { serverURI } from "@/utils/environment";
import axios from "axios";
import { defineStore } from "pinia";

interface Withdraw {
  id: number;
  amount: number;
  title: string;
  body: string;
  created_at: string;
  receiver_address: string;
}

const useWithdrawStore = defineStore("withdraw", {
  state: () => ({
    data: [] as Withdraw[],
    currentWithdraw: {} as Withdraw,
    isLoading: false,
    rowCount: 0,
  }),
  actions: {
    setWithdraw(data: Withdraw[], rowCount: number) {
      this.data = data;
      this.rowCount = rowCount;
    },
    async getWithdraws(campaignId: number, page: number = 1) {
      try {
        this.isLoading = true;

        const response = await axios.get(
          `${serverURI}/api/campaigns/id/${campaignId}/withdraws?page=${page}`
        );

        const data = response.data;
        this.setWithdraw(data.fundDisbursement, data.rowCount);
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async getWithdrawItem(withdrawId: number) {
      try {
        this.isLoading = true;
        const response = await axios.get(
          `${serverURI}/api/campaigns/withdraw/id/${withdrawId}`
        );

        this.currentWithdraw = response.data.withdraw;
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async create(
      campaignId: number,
      amount: number,
      title: string,
      body: string,
      receiverAddress: string
    ) {
      try {
        this.isLoading = true;
        await Promise.all([
          axios.post(
            `${serverURI}/api/campaigns/id/${campaignId}/withdraw`,
            {
              amount: amount,
              title: title,
              body: body,
              receiverAddress: receiverAddress
            },
            {
              withCredentials: true,
            }
          ),
          this.getWithdraws(campaignId),
        ]);
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async update(withdrawId: number, title: string, body: string) {
      try {
        this.isLoading = true;

        await axios.put(
          `${serverURI}/api/campaigns/withdraw/id/${withdrawId}`,
          {
            title: title,
            body: body,
          },
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async delete(campaignId: number, withdrawId: number) {
      try {
        this.isLoading = true;

        await axios.delete(
          `${serverURI}/api/campaigns/withdraw/id/${withdrawId}`,
          {
            withCredentials: true,
          }
        );

        this.getWithdraws(campaignId);
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});

export default useWithdrawStore;
