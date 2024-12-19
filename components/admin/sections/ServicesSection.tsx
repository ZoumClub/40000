"use client";

import { useState } from "react";
import { useServices } from "@/lib/hooks/useServices";
import { AdminHeader } from "../ui/AdminHeader";
import { AdminTable } from "../ui/AdminTable";
import { ServiceDialog } from "../dialogs/ServiceDialog";
import { columns } from "../columns/servicesColumns";

export function ServicesSection() {
  const [showDialog, setShowDialog] = useState(false);
  const { services, isLoading, refresh } = useServices();

  return (
    <div className="space-y-4">
      <AdminHeader 
        title="Services"
        onAdd={() => setShowDialog(true)}
      />

      <AdminTable
        table="services"
        columns={columns}
        data={services}
        isLoading={isLoading}
        onRefresh={refresh}
      />

      <ServiceDialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          refresh();
        }}
      />
    </div>
  );
}