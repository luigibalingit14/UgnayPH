import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/hooks/use-auth";
import { ToastContextProvider } from "@/hooks/use-toast";

export const metadata: Metadata = {
  title: "UgnayPH — Connecting Filipinos to Solutions",
  description:
    "UgnayPH is a unified digital platform that connects Filipinos to solutions across mobility, digital literacy, governance, employment, healthcare, and agriculture. Powered by AI. 🇵🇭",
  keywords: [
    "Philippines", "digital solutions", "fake news", "employment", "healthcare",
    "agriculture", "governance", "transportation", "SDG", "AI", "Filipinos",
  ],
  authors: [{ name: "UgnayPH Team" }],
  creator: "UgnayPH",
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "UgnayPH",
    title: "UgnayPH — Connecting Filipinos to Solutions",
    description: "One platform. Six solutions. For every Filipino. 🇵🇭",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <ToastContextProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
