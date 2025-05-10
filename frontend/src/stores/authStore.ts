import { defineStore } from "pinia";
import axios from "axios";
import { serverURI } from "@/utils/environment";

interface User {
  id: number | null;
  name: string | null;
  role: "ADMIN" | "USER" | null;
  profile_picture: string | null;
}

const useAuthStore = defineStore("auth", {
  state: () => ({} as User),
  actions: {
    setUser(user: User) {
      this.id = user.id;
      this.name = user.name;
      this.role = user.role;
      this.profile_picture = user.profile_picture;
    },

    async authentication(address: string) {
      try {
        const res = await axios.get(
          `${serverURI}/api/users/wallet/${address}`,
          {
            withCredentials: true,
          }
        );
        const { data } = res.data;
        this.setUser(data);
        sessionStorage.setItem("walletAddress", data.wallet_address);
      } catch (err: any) {
        throw err;
      }
    },

    logout() {
      this.id = null;
      this.name = null;
      this.role = null;
      this.profile_picture = null;
    },
  },
  getters: {
    isAdmin(): boolean {
      return this.role === "ADMIN";
    },
  },
});

export default useAuthStore;
