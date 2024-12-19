"use client";

import type { UserCar } from "./userCar";

export interface TableMeta<TData = any> {
  onViewDetails?: (record: TData) => void;
  onViewBids?: (record: TData) => void;
  onToggleApproval?: (id: string, approved: boolean) => void;
  onDelete?: (id: string) => void;
  onEdit?: (record: TData) => void;
  isUpdating?: boolean;
}

declare module '@tanstack/table-core' {
  interface TableMeta<TData> extends TableMeta<TData> {}
}