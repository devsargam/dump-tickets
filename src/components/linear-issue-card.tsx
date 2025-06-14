"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.article
      className="bg-white border border-zinc-200 rounded-lg p-5 hover:border-zinc-300 transition-colors group"
      whileHover={{
        y: -1,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
    >
      <header className="flex items-center justify-between mb-3">
        <span className="px-2 py-1 text-xs font-mono text-zinc-500 bg-zinc-50 rounded border">
          STA-{index}
        </span>
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-zinc-400 hover:text-red-600 hover:bg-red-50"
            onClick={onDelete}
            aria-label="Delete issue"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </header>

      <h3 className="font-medium text-zinc-900 mb-2 leading-snug">{title}</h3>

      {description && (
        <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}

      {footer && (
        <footer className="mt-4 pt-3 border-t border-zinc-100">{footer}</footer>
      )}
    </motion.article>
  );
}
