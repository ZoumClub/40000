"use client";

import { DataTable } from "@/components/ui/data-table";
import { useAdminTable } from "@/lib/hooks/useAdminTable";
import type { ColumnDef } from "@tanstack/react-table";

interface AdminTableProps<T> {
  table: 'brands' | 'services' | 'accessories' | 'news_articles';
  columns: ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function AdminTable<T>({ 
  table,
  columns,
  data,
  isLoading,
  onRefresh
}: AdminTableProps<T>) {
  const { handleDelete, toggleVisibility } = useAdminTable({
    table,
    onRefresh
  });

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onDelete={handleDelete}
      onToggleVisibility={toggleVisibility}
    />
  );
}