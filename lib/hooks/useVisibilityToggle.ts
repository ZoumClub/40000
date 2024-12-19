"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UseVisibilityToggleOptions {
  table: 'brands' | 'services' | 'accessories' | 'news_articles';
  onSuccess?: () => void;
}

export function useVisibilityToggle({ table, onSuccess }: UseVisibilityToggleOptions) {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      // Check if trying to hide "All Brands"
      if (table === 'brands' && !isVisible) {
        const { data } = await supabase
          .from('brands')
          .select('name')
          .eq('id', id)
          .single();

        if (data?.name === 'All Brands') {
          toast.error('"All Brands" must remain visible');
          return;
        }
      }

      const { error } = await supabase
        .from(table)
        .update({ is_visible: isVisible })
        .eq('id', id);

      if (error) {
        console.error('Error updating visibility:', error);
        throw error;
      }

      toast.success(`Item ${isVisible ? 'shown' : 'hidden'} successfully`);
      onSuccess?.();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    toggleVisibility
  };
}