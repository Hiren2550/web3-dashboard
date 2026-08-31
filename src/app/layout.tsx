import "@rainbow-me/rainbowkit/styles.css";
import { Web3Provider } from "@/providers/Web3Provider";
import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: "Web3 Wallet Hub | Ethereum & Sepolia Portal",
  description:
    "Sleek Web3 Wallet Application for managing native ETH balances, ERC-20 token smart contracts, spender approvals, and secure transactions.",
  keywords: [
    "Web3",
    "Ethereum",
    "Sepolia",
    "Wallet",
    "ERC20",
    "USDC",
    "Smart Contract",
    "Wagmi",
    "RainbowKit",
  ],
  authors: [{ name: "Web3 Developer Team" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Web3 Wallet Hub | Ethereum & Sepolia Portal",
    description:
      "Manage native Ethereum balances, inspect ERC-20 smart contracts, and execute secure transactions.",
    url: "https://localhost:3000",
    siteName: "Web3 Wallet Hub",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090e",
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#07090e] text-slate-100" suppressHydrationWarning>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
