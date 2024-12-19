"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { NewsArticle } from "@/types/news";

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching news articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    isLoading,
    refresh: fetchArticles,
  };
}