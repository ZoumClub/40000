"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useServices } from "@/lib/hooks/useServices";
import { ServiceDialog } from "./dialogs/ServiceDialog";
import { columns } from "./columns/servicesColumns";
import { useVisibilityToggle } from "@/lib/hooks/useVisibilityToggle";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function ServicesTab() {
  const [showDialog, setShowDialog] = useState(false);
  const { services, isLoading, refresh } = useServices();
  const { toggleVisibility } = useVisibilityToggle({ 
    table: "services",
    onSuccess: refresh 
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Service deleted successfully");
      refresh();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
        <Button onClick={() => setShowDialog(true)}>Add New Service</Button>
      </div>

      <DataTable
        columns={columns}
        data={services}
        isLoading={isLoading}
        onDelete={handleDelete}
        onToggleVisibility={toggleVisibility}
      />

      <ServiceDialog
        open={showDialog}
        onClose={handleClose}
      />
    </div>
  );
}