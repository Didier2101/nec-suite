import HeaderNecSuite from "@/src/ui/HeaderNecSuite";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "NEC Suite - Soporte de Archivos",
};

export default function FileSupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <HeaderNecSuite
                title="Soporte de Archivos"
                description="Sube y gestiona archivos para procesamiento"
                Icon={FileText}
            />
            <main className="max-w-7xl mx-auto p-4">
                {children}
            </main>
        </>
    );
}