"use client";

import { z } from "zod";

export const newsArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  image_url: z.string().url("Please enter a valid image URL"),
});

export type NewsArticleFormData = z.infer<typeof newsArticleSchema>;