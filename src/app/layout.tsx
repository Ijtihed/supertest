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

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Supertest",
    template: "%s · Supertest",
  },
  description: "Playtesting platform for the Supercell AI Lab batch. Upload your game, get structured feedback from everyone in the cohort.",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Supertest",
    title: "Supertest",
    description: "Playtesting platform for the Supercell AI Lab batch. Upload your game, get structured feedback from everyone in the cohort.",
    images: [{ url: "/socialmediaimg.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Supertest",
    description: "Playtesting platform for the Supercell AI Lab batch.",
    images: ["/socialmediaimg.png"],
  },
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
