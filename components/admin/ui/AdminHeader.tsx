"use client";

import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
  onAdd: () => void;
}

export function AdminHeader({ title, onAdd }: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Button onClick={onAdd}>Add New</Button>
    </div>
  );
}