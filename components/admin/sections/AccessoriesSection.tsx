"use client";

import { useState } from "react";
import { useAccessories } from "@/lib/hooks/useAccessories";
import { AdminHeader } from "../ui/AdminHeader";
import { AdminTable } from "../ui/AdminTable";
import { AccessoryDialog } from "../dialogs/AccessoryDialog";
import { columns } from "../columns/accessoriesColumns";

export function AccessoriesSection() {
  const [showDialog, setShowDialog] = useState(false);
  const { accessories, isLoading, refresh } = useAccessories();

  return (
    <div className="space-y-4">
      <AdminHeader 
        title="Accessories"
        onAdd={() => setShowDialog(true)}
      />

      <AdminTable
        table="accessories"
        columns={columns}
        data={accessories}
        isLoading={isLoading}
        onRefresh={refresh}
      />

      <AccessoryDialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          refresh();
        }}
      />
    </div>
  );
}