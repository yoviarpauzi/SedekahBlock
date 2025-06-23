import { serverURI } from "@/utils/environment";
import { type ColumnDef } from "@tanstack/vue-table";
import axios from "axios";
import { h } from "vue";
import DropdownAction from "./DataTableDropDown.vue";

export interface Campaign {
  id: number;
  categories_id: number;
  title: string;
  target: number;
  end_at: Date;
  balance: number;
  collected: number;
}

const result = await axios.get(`${serverURI}/api/categories`);
const { data } = result.data;
const { categories } = data;

const categoryMap = Object.fromEntries(
  categories.map((cat: { id: number; name: string }) => [cat.id, cat.name])
);

export const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "title",
    header: () => "Title",
  },
  {
    accessorKey: "categories_id",
    header: () => h("div", { class: "text-left" }, "Category"),
    cell: ({ row }) => {
      const categoryId: number = row.getValue("categories_id");
      const categoryName = categoryMap[categoryId];
      return h("div", { class: "text-left" }, categoryName);
    },
  },
  {
    accessorKey: "balance",
    header: () => "Balance",
    cell: ({ row }) => {
      const formatted: string = row.getValue("balance") + " TON";
      return h("div", { class: "text-left " }, formatted);
    },
  },
  {
    accessorKey: "collected",
    header: () => "Collected",
    cell: ({ row }) => {
      const formatted: string = row.getValue("collected") + " TON";
      return h("div", { class: "text-left " }, formatted);
    },
  },
  {
    accessorKey: "target",
    header: () => "Target",
    cell: ({ row }) => {
      const formatted: string = row.getValue("target") + " TON";
      return h("div", { class: "text-left " }, formatted);
    },
  },
  {
    accessorKey: "end_at",
    header: () => "End at",
    cell: ({ row }) => {
      const endAt: string = row.getValue("end_at");
      const formatted = new Date(endAt).toLocaleDateString();
      return h("div", { class: "text-left " }, formatted);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const campaign = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          campaign,
        })
      );
    },
  },
];
