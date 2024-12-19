"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, DollarSign } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import type { DealerCar } from "@/types/dealerCar";

export const columns: ColumnDef<DealerCar>[] = [
  {
    accessorKey: "thumbnail",
    header: "Car",
    cell: ({ row }) => {
      const car = row.original;
      const isSold = car.availability_status === "sold";
      
      return (
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
            {car.images?.[0] && (
              <div className="relative">
                <img
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                {isSold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold transform -rotate-45">SOLD</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{car.brand} {car.model}</div>
            <div className="text-sm text-muted-foreground">{car.year}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price");
      const savings = row.original.savings;
      return (
        <div>
          <div className="font-medium">{formatPrice(price as number)}</div>
          {savings && savings > 0 && (
            <div className="text-sm text-green-600">
              Save {formatPrice(savings)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const approvalStatus = row.original.approval_status;
      const availabilityStatus = row.original.availability_status;
      
      return (
        <div className="space-y-1">
          <Badge 
            variant={
              approvalStatus === "approved" ? "success" : 
              approvalStatus === "rejected" ? "destructive" : 
              "secondary"
            }
          >
            {approvalStatus}
          </Badge>
          {availabilityStatus === "sold" && (
            <Badge variant="destructive">Sold</Badge>
          )}
        </div>
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
    cell: ({ row }) => {
      const car = row.original;
      const isSold = car.availability_status === "sold";
      
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => row.table.options.meta?.onViewDetails?.(car)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant={isSold ? "secondary" : "default"}
            size="sm"
            onClick={() => row.table.options.meta?.onMarkAsSold?.(car)}
            disabled={car.approval_status !== "approved"}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            {isSold ? "Sold" : "Mark as Sold"}
          </Button>
        </div>
      );
    },
  },
];