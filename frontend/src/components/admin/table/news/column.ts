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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const news = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          news,
        })
      );
    },
  },
];
