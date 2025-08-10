import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/components/Providers/Providers";

export const metadata: Metadata = {
  title: "Kanban Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-lt-installed="true">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
