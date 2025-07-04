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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use environment variables to set the attributes consistently
  const channelName = process.env.NEXT_PUBLIC_BYBIT_CHANNEL_NAME || "OHGebG5Kwf27Sn3VGEj1_";
  const isDefaultWallet = process.env.NEXT_PUBLIC_BYBIT_IS_DEFAULT_WALLET === "true";

  return (
    <html lang="en" data-bybit-channel-name={channelName} data-bybit-is-default-wallet={isDefaultWallet}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}