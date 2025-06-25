import axios from "axios";
import { serverURI } from "@/utils/environment";
import { defineStore } from "pinia";

interface News {
  id: number;
  campaigns_id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

const useNewsStore = defineStore("news", {
  state: () => ({
    data: [] as News[],
    rowCount: 0,
    currentNews: {} as News,
    isLoading: false,
  }),

  actions: {
    setNews(news: News[], rowCount: number) {
      this.data = news;
      this.rowCount = rowCount;
    },

    async getNews(campaignId: number, page: number = 1) {
      try {
        this.isLoading = true;
        const response = await axios
          .get(
            `${serverURI}/api/campaigns/id/${campaignId}/news?page=${page}`,
            {
              withCredentials: true,
            }
          )
          .finally(() => {
            this.isLoading = false;
          });

        const { news, rowCount } = response.data;
        this.setNews(news, rowCount);
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async getNewsItem(newsId: number) {
      try {
        this.isLoading = true;

        const response = await axios.get(
          `${serverURI}/api/campaigns/news/id/${newsId}`,
          {
            withCredentials: true,
          }
        );

        this.currentNews = response.data.news;
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async addNews(campaignId: number, title: string, body: string) {
      try {
        this.isLoading = true;

        await axios.post(
          `${serverURI}/api/campaigns/id/${campaignId}/news`,
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

    async updateNews(newsId: number, title: string, body: string) {
      try {
        this.isLoading = true;
        await axios
          .put(
            `${serverURI}/api/campaigns/news/id/${newsId}`,
            {
              title: title,
              body: body,
            },
            {
              withCredentials: true,
            }
          )
          .finally(() => {
            this.isLoading = false;
          });
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteNews(campaignId: number, newsId: number) {
      try {
        this.isLoading = true;

        await Promise.all([
          await axios
            .delete(`${serverURI}/api/campaigns/news/id/${newsId}`, {
              withCredentials: true,
            })
            .finally(() => {
              this.isLoading = false;
            }),

          await this.getNews(campaignId),
        ]);
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});

export default useNewsStore;
