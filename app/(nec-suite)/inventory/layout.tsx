import HeaderNecSuite from "@/src/ui/HeaderNecSuite";
import { Package } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "NEC Suite - inventory",
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
                description="Comprehensive management of network devices and resources"
                Icon={Package}
            />

            <main className="">
                {children}
            </main>
        </>
    );
}