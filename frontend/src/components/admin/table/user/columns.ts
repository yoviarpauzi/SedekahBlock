import { type ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { toUserFriendlyAddress } from "@tonconnect/ui";

export interface User {
  id: number;
  name: string;
  role: "ADMIN" | "USER";
  wallet_address: string;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, "Name"),
  },
  {
    accessorKey: "role",
    header: () => h("div", { class: "text-left" }, "Role"),
  },
  {
    accessorKey: "wallet_address",
    header: () => h("div", { class: "text-left" }, "Wallet Address"),
    cell: ({ row }) => {
      const address: string = row.getValue("wallet_address");
      const formatted: string = toUserFriendlyAddress(address);

      return h("div", { class: "text-left " }, formatted);
    },
  },
];
