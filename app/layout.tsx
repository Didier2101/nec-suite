import type { Metadata } from "next";
import "./globals.css";
import { urbanist } from "@/src/lib/fonts";
import Header from "@/components/Header";




export const metadata: Metadata = {
  title: "Nec - Suite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.className} bg-gray-100 min-h-screen`}
      >
        {/* <Header /> */}
        {children}
      </body>
    </html>
  );
}
