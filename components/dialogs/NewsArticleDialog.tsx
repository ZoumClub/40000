"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { NewsArticle } from "@/types/news";

interface NewsArticleDialogProps {
  article: NewsArticle | null;
  open: boolean;
  onClose: () => void;
}

export function NewsArticleDialog({ article, open, onClose }: NewsArticleDialogProps) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{article.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {formatDate(article.published_at)}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full aspect-video object-cover rounded-lg"
          />
          
          <div className="prose prose-sm max-w-none">
            <p className="text-lg font-medium text-muted-foreground mb-4">
              {article.excerpt}
            </p>
            
            <div className="whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}