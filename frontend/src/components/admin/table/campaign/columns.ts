import { serverURI } from "@/utils/environment";
import { type ColumnDef } from "@tanstack/vue-table";
import axios from "axios";
import { h } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { ArrowUpDown } from "lucide-vue-next";
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
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () =>
            column.toggleSorting(column.getIsSorted() === "asc", true),
        },
        () => ["Title", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
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
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () =>
            column.toggleSorting(column.getIsSorted() === "asc", true),
        },
        () => ["Balance", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
  },
  {
    accessorKey: "collected",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () =>
            column.toggleSorting(column.getIsSorted() === "asc", true),
        },
        () => ["Collected", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
  },
  {
    accessorKey: "target",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () =>
            column.toggleSorting(column.getIsSorted() === "asc", true),
        },
        () => ["Target", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const formatted: string = row.getValue("target") + " TON";
      return h("div", { class: "text-left " }, formatted);
    },
  },
  {
    accessorKey: "end_at",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () =>
            column.toggleSorting(column.getIsSorted() === "asc", true),
        },
        () => ["End At", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
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
