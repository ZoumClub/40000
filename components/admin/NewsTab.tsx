"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useNews } from "@/lib/hooks/useNews";
import { NewsDialog } from "./dialogs/NewsDialog";
import { columns } from "./columns/newsColumns";
import { useVisibilityToggle } from "@/lib/hooks/useVisibilityToggle";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function NewsTab() {
  const [showDialog, setShowDialog] = useState(false);
  const { articles, isLoading, refresh } = useNews();
  const { toggleVisibility } = useVisibilityToggle({ 
    table: "news_articles",
    onSuccess: refresh 
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("news_articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Article deleted successfully");
      refresh();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News Articles</h2>
        <Button onClick={() => setShowDialog(true)}>Add New Article</Button>
      </div>

      <DataTable
        columns={columns}
        data={articles}
        isLoading={isLoading}
        onDelete={handleDelete}
        onToggleVisibility={toggleVisibility}
      />

      <NewsDialog
        open={showDialog}
        onClose={handleClose}
      />
    </div>
  );
}