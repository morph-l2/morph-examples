import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Web3ModalProvider from "../context/Web3Modal";
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
  return (
    <html lang="en" className="bg-[#070E1B] h-full">
      <body className={inter.className}>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
