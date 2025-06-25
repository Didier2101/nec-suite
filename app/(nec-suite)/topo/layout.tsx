import HeaderNecSuite from "@/src/ui/HeaderNecSuite";
import { Network, GitGraph, Route, Server, Wifi } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "NEC Suite - Topología de Red",
    description: "Visualización y gestión de la topología de red de equipos"
};

export default function NecSuiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 overflow-auto">
            {/* Header suite */}
            <HeaderNecSuite
                title="Topología de Red"
                description="Visualización y análisis de la estructura de red"
                Icon={Network} // Opciones alternativas: GitGraph, Route, Server
            // Icon={GitGraph} // Para visualización jerárquica
            // Icon={Route} // Para enrutamiento de red
            // Icon={Server} // Para infraestructura física
            />
            {children}
        </div>
    );
}