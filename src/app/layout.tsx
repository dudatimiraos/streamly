"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DatabaseInitializer from "@/components/DatabaseInitializer";
import VerificadorVencimentos from "@/components/VerificadorVencimentos";
import { metadata } from "./metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);

  // Verificar se já inicializou o banco anteriormente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialized = sessionStorage.getItem("db_initialized") === "true";
      if (initialized) {
        setIsDatabaseInitialized(true);
      }
    }
  }, []);

  return (
    <html lang="pt-BR">
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <meta name="keywords" content={metadata.keywords as string} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased vsc-initialized bg-gray-950 min-h-screen flex flex-col`}
      >
        {!isDatabaseInitialized && <DatabaseInitializer onInitialized={() => setIsDatabaseInitialized(true)} />}
        {isDatabaseInitialized && <VerificadorVencimentos />}
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-20">
          {isDatabaseInitialized ? (
            children
          ) : (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </main>
        <Footer />
      </body>
    </html>
  );
}
