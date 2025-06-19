import { type ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import DropdownAction from "./DataTableDropdown.vue";

interface News {
  id: number;
  title: string;
  body: string;
}

export const columns: ColumnDef<News>[] = [
  {
    accessorKey: "title",
    header: () => "Title",
  },
  {
    accessorKey: "body",
    header: () => "Body",
    cell: ({ row }) => {
      const body = row.original.body;
      const plainText = body.replace(/<[^>]+>/g, "");
      const words = plainText.trim().split(/\s+/).slice(0, 10).join(" ");
      return h("div", { class: "text-left" }, words);
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
