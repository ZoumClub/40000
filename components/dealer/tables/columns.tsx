"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CarCell } from "./cells/CarCell";
import { PriceCell } from "./cells/PriceCell";
import { StatusCell } from "./cells/StatusCell";
import { ActionsCell } from "./cells/ActionsCell";
import { formatDate } from "@/lib/utils";
import type { DealerCar } from "@/types/dealerCar";

interface ColumnOptions {
  onViewDetails: (car: DealerCar) => void;
  onMarkAsSold: (car: DealerCar) => void;
  isUpdating?: boolean;
}

export const columns = ({
  onViewDetails,
  onMarkAsSold,
  isUpdating
}: ColumnOptions): ColumnDef<DealerCar>[] => [
  {
    accessorKey: "thumbnail",
    header: "Car",
    cell: CarCell,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: PriceCell,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: StatusCell,
  },
  {
    accessorKey: "created_at",
    header: "Listed On",
    cell: ({ row }) => formatDate(row.getValue("created_at")),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionsCell
        row={row}
        onViewDetails={onViewDetails}
        onMarkAsSold={onMarkAsSold}
        isUpdating={isUpdating}
      />
    ),
  },
];