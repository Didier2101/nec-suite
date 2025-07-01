import HeaderNecSuite from "@/src/ui/HeaderNecSuite";
import { BookOpenText } from "lucide-react"; // Icono más acorde con RAG
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "NEC Suite - RAG Assistant",
    description: "Asistente de IA con recuperación aumentada para soporte técnico y análisis contextual",
};

export default function NecSuiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <HeaderNecSuite
                title="RAG Assistant"
                description="Asistente inteligente con integración de modelos LLM y recuperación de conocimiento"
                Icon={BookOpenText}
            />
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
