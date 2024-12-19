"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useBrands } from "@/lib/hooks/useBrands";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BrandsTableProps {
  onAdd: () => void;
  onEdit: (brand: any) => void;
}

export function BrandsTable({ onAdd, onEdit }: BrandsTableProps) {
  const { data: brands, isLoading, error, refresh } = useBrands();

  if (error) {
    return <ErrorMessage message="Failed to load brands" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Brand Management</h2>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Brand
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={brands}
          onEdit={onEdit}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}