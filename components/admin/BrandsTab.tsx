"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useBrands } from "@/lib/hooks/useBrands";
import { BrandDialog } from "./dialogs/BrandDialog";
import { columns } from "./columns/brandsColumns";
import { useVisibilityToggle } from "@/lib/hooks/useVisibilityToggle";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function BrandsTab() {
  const [showDialog, setShowDialog] = useState(false);
  const { data: brands, isLoading, error, refresh } = useBrands();
  const { toggleVisibility } = useVisibilityToggle({ 
    table: "brands",
    onSuccess: refresh 
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Brand deleted successfully");
      refresh();
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete brand");
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    refresh();
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load brands. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Brand Management</h2>
        <Button onClick={() => setShowDialog(true)}>Add New Brand</Button>
      </div>

      <DataTable
        columns={columns}
        data={brands || []}
        isLoading={isLoading}
        onDelete={handleDelete}
        onToggleVisibility={toggleVisibility}
      />

      <BrandDialog
        open={showDialog}
        onClose={handleClose}
      />
    </div>
  );
}