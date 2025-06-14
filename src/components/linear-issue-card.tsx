"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Trash2, Check, X } from "lucide-react";

interface IssueCardProps {
  index: number;
  title: string;
  description?: string;
  footer?: ReactNode;
  onDelete?: () => void;
  onEdit?: (title: string, description: string) => void;
}

export function IssueCard({
  index,
  title,
  description,
  footer,
  onDelete,
  onEdit,
}: IssueCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || "");

  const handleTitleSave = () => {
    if (onEdit && editTitle.trim()) {
      onEdit(editTitle.trim(), editDescription);
      setIsEditingTitle(false);
    }
  };

  const handleDescriptionSave = () => {
    if (onEdit) {
      onEdit(editTitle, editDescription.trim());
      setIsEditingDescription(false);
    }
  };

  const handleTitleCancel = () => {
    setEditTitle(title);
    setIsEditingTitle(false);
  };

  const handleDescriptionCancel = () => {
    setEditDescription(description || "");
    setIsEditingDescription(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === "Escape") {
      handleTitleCancel();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      handleDescriptionSave();
    } else if (e.key === "Escape") {
      handleDescriptionCancel();
    }
  };

  const handleTitleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleDescriptionFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.select();
  };

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

      {/* Editable Title */}
      {isEditingTitle ? (
        <div className="flex items-center gap-2">
          <Input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onFocus={handleTitleFocus}
            className="text-sm font-semibold flex-1 focus:ring-0"
            placeholder="Issue title..."
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-green-600 hover:text-green-700"
            onClick={handleTitleSave}
            disabled={!editTitle.trim()}
          >
            <Check className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleTitleCancel}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <h3 
          className="text-sm font-semibold leading-snug line-clamp-2 flex-1 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
          onClick={() => setIsEditingTitle(true)}
          title="Click to edit title"
        >
          {title}
        </h3>
      )}

      {/* Editable Description */}
      {isEditingDescription ? (
        <div className="flex flex-col gap-2">
          <Textarea
            autoFocus
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleDescriptionKeyDown}
            onFocus={handleDescriptionFocus}
            className="text-sm resize-none min-h-[80px] focus:ring-0"
            placeholder="Issue description..."
          />
          <div className="flex items-center gap-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-green-600 hover:text-green-700"
              onClick={handleDescriptionSave}
            >
              <Check className="size-3 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-muted-foreground hover:text-destructive"
              onClick={handleDescriptionCancel}
            >
              <X className="size-3 mr-1" />
              Cancel
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Press Cmd+Enter to save, Escape to cancel
          </p>
        </div>
      ) : (
        description && (
          <p 
            className="text-sm text-muted-foreground line-clamp-3 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
            onClick={() => setIsEditingDescription(true)}
            title="Click to edit description"
          >
            {description}
          </p>
        )
      )}

      {/* Add description button when no description exists and not editing */}
      {!description && !isEditingDescription && (
        <button
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer text-left italic hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
          onClick={() => setIsEditingDescription(true)}
        >
          Click to add description...
        </button>
      )}

      {footer && <footer className="mt-auto pt-2">{footer}</footer>}
    </article>
  );
}
