import MobileNav from "@/components/movil/MobileNav";
import Sidebar from "@/components/Sidebar";

export default function NecSuiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen ">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                {children}
            </div>
            {/* Navegación móvil */}
            <MobileNav />
        </div>
    );
}