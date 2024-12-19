"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import type { Brand } from "@/types";

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
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active");
      return (
        <Badge variant={isActive ? "success" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const brand = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.options.meta?.onEdit(brand)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => table.options.meta?.onDelete(brand.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];