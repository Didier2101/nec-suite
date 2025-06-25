import HeaderNecSuite from "@/src/ui/HeaderNecSuite";
import { BrainCircuit, Bot, Network, BarChartBig } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "NEC Suite - Machine Learning",
    description: "Plataforma de inteligencia artificial para análisis predictivo",
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
                title="Machine Learning Platform"
                description="Modelos predictivos y análisis inteligente de datos"
                Icon={BrainCircuit}
            // Opciones alternativas de iconos:
            // Icon={Bot} // Para IA conversacional
            // Icon={Network} // Para redes neuronales
            // Icon={BarChartBig} // Para análisis predictivo
            />
            {children}
        </>
    );
}