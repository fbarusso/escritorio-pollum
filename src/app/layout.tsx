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
        <footer className="fixed bottom-0 w-full text-center py-4">
          <p className="text-sm text-muted-foreground">
            built at{" "}
            <a
              className="underline"
              href="https://aegislabs.com.br/"
              target="_blank"
            >
              aegislabs
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
