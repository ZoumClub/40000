"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsArticleSchema } from "@/lib/validations/news";
import type { NewsArticle } from "@/types/news";

export function useNewsForm(article?: NewsArticle | null) {
  return useForm({
    resolver: zodResolver(newsArticleSchema),
    defaultValues: article ? {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image_url: article.image_url,
    } : {
      title: "",
      excerpt: "",
      content: "",
      image_url: "",
    },
  });
}