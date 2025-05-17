import DropdownAction from "@/components/admin/table/categories/DataTableDropDown.vue";
import { type ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { ArrowUpDown } from "lucide-vue-next";

export interface Category {
  id: number;
  name: string;
  _count: {
    campaigns: number;
  };
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    // header: () => h("div", { class: "text-left" }, "Name"),
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
  },
  {
    accessorKey: "_count.campaigns",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Number of campaign", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          category,
        })
      );
    },
  },
];
