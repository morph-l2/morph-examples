import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ContextProvider from "../context/Web3Modal";
import { headers } from "next/headers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Morph Holesky Starter Kit",
  description: "A starter kit for building on Morph Holesky",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");
  return (
    <html lang="en" className="bg-[#070E1B]">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
