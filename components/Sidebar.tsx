'use client';

import { FormButton } from "@/src/ui/FormButton";
import {
    Server,
    Cpu,
    Archive,
    Settings,
    ChevronRightIcon,
    ChevronLeftIcon,
    LogOut,
    ChartNetwork
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

const navigationItems = [
    {
        name: 'VNOC',
        href: '/nec-suite/vnoc',
        icon: Server,
    },
    {
        name: 'RAG',
        href: '/nec-suite/rac',
        icon: Cpu,
    },
    {
        name: 'Inventory',
        href: '/nec-suite/inventory',
        icon: Archive,
    },
    {
        name: 'Topo Logic',
        href: '/nec-suite/topo',
        icon: ChartNetwork,
    },
    {
        name: 'Administracion',
        href: '/nec-suite/admin',
        icon: Settings,
    },

];

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción cerrará tu sesión actual.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch('/api/logout', { method: 'POST' });

            if (res.ok) {
                // Limpia los datos almacenados

                await Swal.fire({
                    title: 'Sesión cerrada',
                    text: 'Has cerrado sesión exitosamente.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });

                router.push('/');
            } else {
                Swal.fire('Error', 'No se pudo cerrar la sesión.', 'error');
            }
        } catch (error) {
            console.error('Error de red:', error);
            Swal.fire('Error', 'Hubo un problema de red al cerrar la sesión.', 'error');
        }
    };

    return (
        <div className={`flex flex-col bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} h-screen ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                {!collapsed && (
                    <h1 className="text-xl font-bold">NEC Suite</h1>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRightIcon className="h-5 w-5" />
                    ) : (
                        <ChevronLeftIcon className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto mt-6">
                <ul className="space-y-2 px-3">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    title={collapsed ? item.name : ''}
                                >
                                    <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                                    {!collapsed && (
                                        <span>{item.name}</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            {!collapsed && (
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">U</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">Usuario</p>
                            <p className="text-xs text-gray-400">Admin</p>
                        </div>
                    </div>
                    <FormButton
                        onClick={handleLogout}
                        icon={LogOut}
                        size="sm"
                        className="w-full bg-gray-900 border border-gray-400 hover:bg-gray-800"
                    >
                        Cerrar sesión
                    </FormButton>
                </div>
            )}
        </div>
    );
}
