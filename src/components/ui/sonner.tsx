"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group relative flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50",
          description: "text-sm opacity-90",
          actionButton:
            "inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200",
          cancelButton:
            "inline-flex items-center justify-center rounded-md bg-transparent px-3 py-1 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
          closeButton:
            "absolute right-2 top-2 rounded-md p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-200",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
