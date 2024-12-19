"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNewsForm } from "@/lib/hooks/useNewsForm";
import type { NewsArticle } from "@/types/news";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface NewsDialogProps {
  open: boolean;
  onClose: () => void;
  article?: NewsArticle | null;
}

export function NewsDialog({ open, onClose, article }: NewsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useNewsForm(article);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      if (article?.id) {
        const { error } = await supabase
          .from("news_articles")
          .update(data)
          .eq("id", article.id);
          
        if (error) throw error;
        toast.success("Article updated successfully");
      } else {
        const { error } = await supabase
          .from("news_articles")
          .insert([data]);
          
        if (error) throw error;
        toast.success("Article created successfully");
      }

      onClose();
    } catch (error) {
      console.error("Error saving news article:", error);
      toast.error("Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {article ? "Edit Article" : "Add New Article"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[200px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}