import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "DevUtils Pro | Geradores de CPF, CNPJ e Ferramentas para Devs",
  description: "A caixa de ferramentas definitiva para desenvolvedores brasileiros. Gere CPFs, CNPJs, UUIDs, formate JSON e senhas seguras. Tudo grátis e com privacidade total.",
  keywords: ["gerador cpf", "gerador cnpj", "ferramentas dev", "utilitários desenvolvedor", "cpf válido", "cnpj válido", "formatação json", "segurança dev"],
  authors: [{ name: "Alisson Arruda", url: "https://github.com/alissonarruda" }],
  creator: "Alisson Arruda",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://devutils-swart.vercel.app", // URL oficial do projeto
    title: "DevUtils Pro | Geradores e Ferramentas Gratuitas",
    description: "Cansado de sites lentos e com anúncios? Use o DevUtils Pro para gerar CPFs, CNPJs e muito mais com uma interface premium.",
    siteName: "DevUtils Pro",
    images: [{
      url: "/og-image.png", // Next.js pegará automaticamente da pasta public ou opengraph-image.tsx
      width: 1200,
      height: 630,
      alt: "DevUtils Pro Preview"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevUtils Pro | Ferramentas para Desenvolvedores",
    description: "Geradores brasileiros e utilitários dev de alta performance.",
    creator: "@alissonarruda",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "wv1OfFP8jhMyabw4kJffgUNF3sfT2QbdpBN2o5I-v6E",
  },
  alternates: {
    canonical: "https://devutils-swart.vercel.app",
  }
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
