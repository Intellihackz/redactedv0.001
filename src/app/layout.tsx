import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus - NFT Design Studio",
  description: "Create, customize, and mint unique NFTs with Nexus, the decentralized NFT design studio",
  openGraph: {
    title: "Nexus - NFT Design Studio",
    description: "Create, customize, and mint unique NFTs with Nexus, the decentralized NFT design studio",
    url: "https://app-nexus.vercel.app",
    siteName: "Nexus NFT Studio",
    images: [
      {
        url: "https://app-nexus.vercel.app/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Nexus - NFT Design Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus - NFT Design Studio",
    description: "Create, customize, and mint unique NFTs with Nexus, the decentralized NFT design studio",
    creator: "@zephyrdev_",
    images: ["https://app-nexus.vercel.app/twitter-image.jpg"], 
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
