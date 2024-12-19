"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useVisibilityToggle } from "./useVisibilityToggle";

interface UseAdminTableOptions {
  table: 'brands' | 'services' | 'accessories' | 'news_articles';
  onRefresh: () => void;
}

export function useAdminTable({ table, onRefresh }: UseAdminTableOptions) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toggleVisibility } = useVisibilityToggle({ 
    table, 
    onSuccess: onRefresh 
  });

  const handleDelete = async (id: string) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Item deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    handleDelete,
    toggleVisibility
  };
}