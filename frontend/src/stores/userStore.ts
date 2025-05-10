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
  }),

  actions: {
    setUsers(users: User[], rowCount: number) {
      this.data = users;
      this.rowCount = rowCount;
    },
  },
});
