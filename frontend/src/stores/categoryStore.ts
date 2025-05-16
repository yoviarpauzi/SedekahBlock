import { defineStore } from "pinia";
import { serverURI } from "@/utils/environment";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  _count: {
    campaigns: number;
  };
}

const useCategoryStore = defineStore("category", {
  state: () => ({
    data: [] as Category[],
    rowCount: 0,
    isLoading: false,
  }),

  actions: {
    setCategories(categories: Category[], rowCount: number) {
      this.data = categories;
      this.rowCount = rowCount;
    },

    async fetchCategories() {
      try {
        this.isLoading = true;
        const response = await axios.get(`${serverURI}/api/categories`);

        const { data } = response.data;
        const { categories, rowCount } = data;
        this.setCategories(categories, rowCount);
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addCategories(name: string) {
      try {
        this.isLoading = true;

        await axios.post(
          `${serverURI}/api/categories`,
          {
            name: name,
          },
          {
            withCredentials: true,
          }
        );

        await this.fetchCategories();
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateCategories(id: number, name: string) {
      try {
        this.isLoading = true;

        await axios.put(
          `${serverURI}/api/categories`,
          {
            id: id,
            name: name,
          },
          {
            withCredentials: true,
          }
        );

        await this.fetchCategories();
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteCategories(id: number) {
      try {
        this.isLoading = true;

        await axios.delete(`${serverURI}/api/categories/id/${id}`, {
          withCredentials: true,
        });

        await this.fetchCategories();
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});

export default useCategoryStore;
