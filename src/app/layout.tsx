import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { AppProvider } from "@/lib/i18n/context";
import { ToastProvider } from "@/lib/toast/context";
import { ToastContainer } from "@/components/ui/toast-container";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Supertest",
  description: "Supertest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <AppProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
