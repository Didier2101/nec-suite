import MobileNav from "@/components/movil/MobileNav";
import Sidebar from "@/components/Sidebar";
import "../globals.css";
import { Metadata } from "next";
import { urbanist } from "@/src/lib/fonts";

export const metadata: Metadata = {
    title: "Nec - Suite",
    description: "Panel de administración de NEC Suite",

};

export default function NecSuiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${urbanist.className} flex h-screen`}>
                <Sidebar />
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {children}
                </div>
                <MobileNav />
            </body>
        </html>

    );
}