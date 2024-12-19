"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Car } from "@/types/car";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Car>[] = [
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatPrice(row.getValue("price")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "approved" ? "success" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Listed On",
    cell: ({ row }) => formatDate(row.getValue("created_at")),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const car = row.original;
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => table.options.meta?.onEdit(car)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => table.options.meta?.onDelete(car.id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];