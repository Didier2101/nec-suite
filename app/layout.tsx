import type { Metadata } from "next";
import "./globals.css";
import { urbanist } from "@/src/lib/fonts";

export const metadata: Metadata = {
  title: "Nec - Suite",
  description: "Panel de administración de NEC Suite",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.className} bg-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}