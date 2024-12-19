"use client";

import { useState } from "react";
import { useBrands } from "@/lib/hooks/useBrands";
import { AdminHeader } from "../ui/AdminHeader";
import { AdminTable } from "../ui/AdminTable";
import { BrandDialog } from "../dialogs/BrandDialog";
import { columns } from "../columns/brandsColumns";

export function BrandsSection() {
  const [showDialog, setShowDialog] = useState(false);
  const { data: brands, isLoading, error, refresh } = useBrands();

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load brands. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminHeader 
        title="Brand Management"
        onAdd={() => setShowDialog(true)}
      />

      <AdminTable
        table="brands"
        columns={columns}
        data={brands || []}
        isLoading={isLoading}
        onRefresh={refresh}
      />

      <BrandDialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          refresh();
        }}
      />
    </div>
  );
}