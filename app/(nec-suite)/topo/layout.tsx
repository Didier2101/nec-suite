import HeaderNecSuite from "@/src/ui/HeaderNecSuite";
import { Package } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Nec - Suite - Topo Logic",
};

export default function NecSuiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex-1 overflow-auto">
            {/* Header */}
            <HeaderNecSuite
                title="Network Topo Login Management"
                description="Gestión completa de equipos y recursos de red"
                Icon={Package}
            />
            {children}
        </div>
    );
}