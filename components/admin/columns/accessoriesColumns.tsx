"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { Accessory } from "@/types/accessory";
import { formatPrice } from "@/lib/utils";

export const columns: ColumnDef<Accessory>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatPrice(row.getValue("price")),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return description.length > 100 
        ? `${description.slice(0, 100)}...` 
        : description;
    },
  },
  {
    accessorKey: "is_visible",
    header: "Visibility",
    cell: ({ row, table }) => {
      const isVisible = row.getValue("is_visible");
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={isVisible as boolean}
            onCheckedChange={(checked) => 
              table.options.meta?.onToggleVisibility(row.original.id, checked)
            }
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
      const accessory = row.original;
      return (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => table.options.meta?.onDelete(accessory.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];