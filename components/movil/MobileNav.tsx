'use client';

import {
    Server,
    Cpu,
    Archive,
    Network,
    BrainCircuit,
    Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
    { name: "VNOC", href: "/vnoc", icon: Server },
    { name: "RAG", href: "/rac", icon: Cpu },
    { name: "Inventory", href: "/inventory", icon: Archive },
    { name: "Topo", href: "/topo", icon: Network },
    { name: "ML", href: "/machine", icon: BrainCircuit },
    { name: "Admin", href: "/admin", icon: Settings },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden">
            <nav className="flex justify-around items-center h-14">
                {navItems.map(({ name, href, icon: Icon }) => {
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={name}
                            href={href}
                            className={clsx(
                                "flex flex-col items-center justify-center text-xs text-gray-500 hover:text-blue-600 transition-colors",
                                isActive && "text-blue-600"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {/* Icon only, or name if you want */}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
