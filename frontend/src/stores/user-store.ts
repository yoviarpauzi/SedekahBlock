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

    async fetchUsers(limit: number = 5) {
      try {
        const params = new URLSearchParams(window.location.search);

        params.set("limit", limit.toString());

        this.isLoading = true;

        const res = await axios.get(
          `${serverURI}/api/users?${params.toString()}`,
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
