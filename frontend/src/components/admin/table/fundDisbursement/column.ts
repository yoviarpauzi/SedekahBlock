import { type ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import DropdownAction from "./DataTableDropdown.vue";

interface Withdraw {
  id: number;
  amount: number;
  title: string;
  body: string;
}

export const columns: ColumnDef<Withdraw>[] = [
  {
    accessorKey: "title",
    header: () => "Title",
  },
  {
    accessorKey: "amount",
    header: () => "Amount",
    cell: ({ row }) => {
      const formatted: string = row.getValue("amount") + " TON";
      return h("div", { class: "text-left " }, formatted);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const withdraw = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          withdraw,
        })
      );
    },
  },
];
