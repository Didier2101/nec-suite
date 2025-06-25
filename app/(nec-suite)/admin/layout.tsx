import HeaderNecSuite from "@/src/ui/HeaderNecSuite";
import { Package } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Nec - Suite - Administracion",
};

export default function NecSuiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
            {/* Header suite */}
            <HeaderNecSuite
                title="Administración de la Plataforma"
                description="Administra usuarios, permisos y configuraciones del sistema"
                Icon={Package}
            />

            {children}
        </>
    );
}