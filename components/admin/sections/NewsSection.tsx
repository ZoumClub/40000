"use client";

import { useState } from "react";
import { useNews } from "@/lib/hooks/useNews";
import { AdminHeader } from "../ui/AdminHeader";
import { AdminTable } from "../ui/AdminTable";
import { NewsDialog } from "../dialogs/NewsDialog";
import { columns } from "../columns/newsColumns";

export function NewsSection() {
  const [showDialog, setShowDialog] = useState(false);
  const { articles, isLoading, refresh } = useNews();

  return (
    <div className="space-y-4">
      <AdminHeader 
        title="News Articles"
        onAdd={() => setShowDialog(true)}
      />

      <AdminTable
        table="news_articles"
        columns={columns}
        data={articles}
        isLoading={isLoading}
        onRefresh={refresh}
      />

      <NewsDialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          refresh();
        }}
      />
    </div>
  );
}