import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configuración de metadatos con favicon súper minimalista: Fondo verde con letras "WC" en blanco
export const metadata: Metadata = {
  title: "World Cup Challenge",
  description: "Created by Roberto Josué",
  icons: {
    icon: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Fondo verde plano y limpio de la cancha -->
        <rect width="100" height="100" rx="20" fill="rgb(34,197,94)" />
        
        <!-- Letras WC en blanco, mayúsculas, gruesas y perfectamente centradas -->
        <text 
          x="50%" 
          y="55%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          fill="white" 
          font-family="system-ui, sans-serif" 
          font-weight="900" 
          font-size="48"
          letter-spacing="-2"
        >
          WC
        </text>
      </svg>
    `).trim()}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}