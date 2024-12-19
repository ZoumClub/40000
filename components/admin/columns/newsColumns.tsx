"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { NewsArticle } from "@/types/news";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<NewsArticle>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "excerpt",
    header: "Excerpt",
    cell: ({ row }) => {
      const excerpt = row.getValue("excerpt") as string;
      return excerpt.length > 100 
        ? `${excerpt.slice(0, 100)}...` 
        : excerpt;
    },
  },
  {
    accessorKey: "published_at",
    header: "Published",
    cell: ({ row }) => formatDate(row.getValue("published_at")),
  },
  {
    accessorKey: "is_visible",
    header: "Visibility",
    cell: ({ row, table }) => {
      const isVisible = row.getValue("is_visible");
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={isVisible as boolean}
            onCheckedChange={(checked) => 
              table.options.meta?.onToggleVisibility(row.original.id, checked)
            }
          />
          {isVisible ? (
            <Eye className="h-4 w-4 text-green-500" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const article = row.original;
      return (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => table.options.meta?.onDelete(article.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];