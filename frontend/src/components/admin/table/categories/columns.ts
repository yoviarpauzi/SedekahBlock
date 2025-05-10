import DropdownAction from "@/components/admin/table/categories/DataTableDropDown.vue";
import { type ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

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
    header: () => h("div", { class: "text-left" }, "Name"),
  },
  {
    accessorKey: "_count.campaigns",
    header: () => h("div", { class: "text-left" }, "Number of campaign"),
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
