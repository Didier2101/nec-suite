import HeaderNecSuite from "@/src/ui/HeaderNecSuite";
import { ServerCog } from "lucide-react"; // Icon representing monitoring and operations
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "NEC Suite - Virtual NOC",
    description: "Virtual operations center for intelligent infrastructure monitoring",
};

export default function NecSuiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <HeaderNecSuite
                title="Virtual NOC"
                description="Automated supervision and assistance for network operations"
                Icon={ServerCog}
            />
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
