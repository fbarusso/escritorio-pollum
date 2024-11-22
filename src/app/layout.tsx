import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conversor Pollum",
  description: "Conversão de arquivos de pagamentos e recebimentosp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={"antialiased"}>
        {children} <Toaster />
      </body>
    </html>
  );
}
