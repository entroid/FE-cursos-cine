import type { Metadata } from "next";
import { Radio_Canada } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const radioCanada = Radio_Canada({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-radio-canada",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Escuela de Cine",
  description: "Plataforma de formación cinematográfica alternativa",
};

import { Providers } from "@/components/providers/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          radioCanada.variable
        )}
      >
        <Providers>
          <Navbar />
          <main className="flex-1 bg-main px-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
