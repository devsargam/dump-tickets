"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Trash2, X } from "lucide-react";

interface IssueCardProps {
  index: number;
  title: string;
  description?: string;
  footer?: ReactNode;
  onDelete?: () => void;
}

export function IssueCard({
  index,
  title,
  description,
  footer,
  onDelete,
}: IssueCardProps) {
  return (
    <article className="relative bg-muted/50 border border-muted rounded-md p-4 flex flex-col gap-2 hover:bg-muted transition-colors">
      <header className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-widest">
        <span>STA-{index}</span>
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={onDelete}
            aria-label="Delete issue"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </header>

      <h3 className="text-sm font-semibold leading-snug line-clamp-2 flex-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      )}

      {footer && <footer className="mt-auto pt-2">{footer}</footer>}
    </article>
  );
}
