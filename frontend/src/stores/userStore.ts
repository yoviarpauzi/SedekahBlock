import { serverURI } from "@/utils/environment";
import axios from "axios";
import { defineStore } from "pinia";

interface User {
  id: number;
  name: string;
  role: string;
  profile_picture: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    data: [] as User[],
    rowCount: 0,
    isLoading: false,
  }),

  actions: {
    setUsers(users: User[], rowCount: number) {
      this.data = users;
      this.rowCount = rowCount;
    },

    async fetchUsers(page: number = 1, search: string = "") {
      try {
        this.isLoading = true;

        const res = await axios.get(
          `${serverURI}/api/users?page=${page}&search=${search}`,
          {
            withCredentials: true,
          }
        );

        const { data } = res.data;
        const { users, rowCount } = data;
        this.setUsers(users, rowCount);
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
