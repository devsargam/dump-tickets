import { ReactNode } from "react";

interface IssueCardProps {
  index: number;
  title: string;
  description?: string;
  footer?: ReactNode;
}

export function IssueCard({
  index,
  title,
  description,
  footer,
}: IssueCardProps) {
  return (
    <article className="bg-muted/50 border border-muted rounded-md p-4 flex flex-col gap-2 hover:bg-muted transition-colors">
      <header className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
        SAR-{index}
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
