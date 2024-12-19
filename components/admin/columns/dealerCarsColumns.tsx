"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DealerCar } from "@/types/dealerCar";
import { formatPrice, formatDate } from "@/lib/utils";

export const columns: ColumnDef<DealerCar>[] = [
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.getValue("type") === "new" ? "default" : "secondary"}>
        {row.getValue("type")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge 
        variant={
          row.getValue("status") === "approved" 
            ? "success" 
            : row.getValue("status") === "rejected"
            ? "destructive"
            : "secondary"
        }
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
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