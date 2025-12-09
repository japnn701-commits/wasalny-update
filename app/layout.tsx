import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "وصلني عامل - خدمتك لحد باب بيتك",
  description: "منصة ذكية تربط بين العملاء والعمال الحرفيين - سباكين، كهربائيين، نقاشين، محارة، تشطيب وصيانة",
  keywords: ["عامل", "سباك", "كهربائي", "نقاش", "محارة", "تشطيب", "صيانة", "خدمات منزلية"],
  authors: [{ name: "وصلني عامل" }],
  creator: "وصلني عامل",
  publisher: "وصلني عامل",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "وصلني عامل - خدمتك لحد باب بيتك",
    description: "منصة ذكية تربط بين العملاء والعمال الحرفيين",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "وصلني عامل",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "وصلني عامل - خدمتك لحد باب بيتك",
    description: "منصة ذكية تربط بين العملاء والعمال الحرفيين",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
            {children}
            <Footer />
          </Suspense>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
