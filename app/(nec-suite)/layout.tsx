// app/(nec-suite)/layout.tsx
// import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function NecSuiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar fijo a la izquierda */}
            <Sidebar />

            {/* Contenido principal */}
            <div className="flex-1 overflow-auto">
                {/* <Header /> */}
                <main className="">
                    {children}
                </main>
            </div>
        </div>
    );
}