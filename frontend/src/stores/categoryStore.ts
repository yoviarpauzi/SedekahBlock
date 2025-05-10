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
  }),

  actions: {
    setCategories(categories: Category[], rowCount: number) {
      this.data = categories;
      this.rowCount = rowCount;
    },

    async fetchCategories(search: string = "", page: string = "1") {
      try {
        const response = await axios.get(
          `${serverURI}/api/categories?page=${page}&search=${search}`
        );

        const { data } = response.data;
        const { categories, rowCount } = data;
        this.setCategories(categories, rowCount);
      } catch (error) {
        throw error;
      }
    },

    async addCategories(name: string) {
      try {
        await axios.post(
          `${serverURI}/api/categories`,
          {
            name: name,
          },
          {
            withCredentials: true,
          }
        );

        await this.fetchCategories("", "1");
      } catch (error) {
        throw error;
      }
    },

    async updateCategories(
      id: number,
      name: string,
      search: string,
      page: string
    ) {
      try {
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

        await this.fetchCategories(search, page);
      } catch (err) {
        throw err;
      }
    },

    async deleteCategories(id: number, search: string, page: string) {
      try {
        await axios.delete(`${serverURI}/api/categories/${id}`, {
          withCredentials: true,
        });

        await this.fetchCategories(search, page);
      } catch (err) {
        throw err;
      }
    },
  },
});

export default useCategoryStore;
