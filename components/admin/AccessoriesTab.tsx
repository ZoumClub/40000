"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useAccessories } from "@/lib/hooks/useAccessories";
import { AccessoryDialog } from "./dialogs/AccessoryDialog";
import { columns } from "./columns/accessoriesColumns";
import { useVisibilityToggle } from "@/lib/hooks/useVisibilityToggle";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function AccessoriesTab() {
  const [showDialog, setShowDialog] = useState(false);
  const { accessories, isLoading, refresh } = useAccessories();
  const { toggleVisibility } = useVisibilityToggle({ 
    table: "accessories",
    onSuccess: refresh 
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("accessories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Accessory deleted successfully");
      refresh();
    } catch (error) {
      console.error("Error deleting accessory:", error);
      toast.error("Failed to delete accessory");
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Accessories</h2>
        <Button onClick={() => setShowDialog(true)}>Add New Accessory</Button>
      </div>

      <DataTable
        columns={columns}
        data={accessories}
        isLoading={isLoading}
        onDelete={handleDelete}
        onToggleVisibility={toggleVisibility}
      />

      <AccessoryDialog
        open={showDialog}
        onClose={handleClose}
      />
    </div>
  );
}