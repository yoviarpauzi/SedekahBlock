import { defineStore, type StoreDefinition } from "pinia";

const useUserStore: StoreDefinition = defineStore("user", {
  state: () => ({
    id: null as number | null,
    profile_picture: null as string | null,
    name: null as string | null,
    email: null as string | null,
    role: null as "SUPERADMIN" | "ADMIN" | "USER" | null,
  }),
  actions: {
    setUser(user: {
      id: number;
      name: string;
      role: "SUPERADMIN" | "ADMIN" | "USER";
      email: string | null;
      profile_picture: string;
    }) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.profile_picture = user.profile_picture;
      this.role = user.role;
    },
  },
});

export default useUserStore;
