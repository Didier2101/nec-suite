import HeaderNecSuite from "@/src/ui/HeaderNecSuite";
import { Package } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Nec - Suite - inventory",
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
                title="Network Inventory Management"
                description="Gestión completa de equipos y recursos de red"
                Icon={Package}
            />
            {children}
        </>
    );
}