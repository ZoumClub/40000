"use client";

import { type CellContext } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { DealerCar } from "@/types/dealerCar";

export function StatusCell({ row }: CellContext<DealerCar, unknown>) {
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
}