import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Provider as BalanceProvider } from 'react-wrap-balancer';

export const metadata: Metadata = {
  title: "Linear Issue Importer",
  description:
    "Import your tasks to Linear in seconds with AI-powered organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <BalanceProvider>
          {children}
        </BalanceProvider>
        <Toaster />
      </body>
    </html>
  );
}
