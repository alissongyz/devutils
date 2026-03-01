import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "DevUtils Pro | Gerador de Dados para Desenvolvedores",
  description: "Gere CPFs, CNPJs, UUIDs e endereços brasileiros válidos em segundos. Interface moderna e premium para facilitar seu fluxo de desenvolvimento.",
  keywords: "gerador cpf, gerador cnpj, gerador uuid, dev tools, utilitários desenvolvedor, testes de software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="font-sans antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
