"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Eye, EyeOff } from "lucide-react";
import type { Brand } from "@/types/brand";

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "order_index",
    header: "Order",
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("order_index")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "logo_url",
    header: "Logo",
    cell: ({ row }) => (
      <div className="w-12 h-12 relative">
        <img
          src={row.getValue("logo_url")}
          alt={`${row.getValue("name")} logo`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    ),
  },
  {
    accessorKey: "is_visible",
    header: "Visibility",
    cell: ({ row, table }) => {
      const isVisible = row.getValue("is_visible");
      const isAllBrands = row.getValue("name") === "All Brands";

      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={isVisible as boolean}
            onCheckedChange={(checked) => 
              table.options.meta?.onToggleVisibility(row.original.id, checked)
            }
            disabled={isAllBrands}
          />
          {isVisible ? (
            <Eye className="h-4 w-4 text-green-500" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const brand = row.original;
      const isAllBrands = brand.name === "All Brands";

      return (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => table.options.meta?.onDelete(brand.id)}
          disabled={isAllBrands}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];