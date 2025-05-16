import { serverURI } from "@/utils/environment";
import { type ColumnDef } from "@tanstack/vue-table";
import axios from "axios";
import { h } from "vue";

export interface Campaign {
  id: number;
  categories_id: number;
  title: string;
  target: number;
  end_at: Date;
  balance: number;
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
    header: () => h("div", { class: "text-left" }, "Title"),
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
    header: () => h("div", { class: "text-left" }, "Balance"),
  },
  {
    accessorKey: "target",
    header: () => h("div", { class: "text-left" }, "Target"),
    cell: ({ row }) => {
      const formatted: string = row.getValue("target") + " TON";
      return h("div", { class: "text-left " }, formatted);
    },
  },
  {
    accessorKey: "end_at",
    header: () => h("div", { class: "text-left" }, "End At"),
    cell: ({ row }) => {
      const endAt: string = row.getValue("end_at");
      const formatted = new Date(endAt).toLocaleDateString();
      return h("div", { class: "text-left " }, formatted);
    },
  },
];
