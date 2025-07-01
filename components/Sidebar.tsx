'use client';

import {
    Server,
    Cpu,
    Archive,
    Settings,
    ChevronRightIcon,
    ChevronLeftIcon,
    LogOut,
    BrainCircuit,
    Network,
    FileText
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

const navigationItems = [
    {
        name: 'VNOC',
        href: '/vnoc',
        icon: Server,
    },
    {
        name: 'RAG',
        href: '/rac',
        icon: Cpu,
    },
    {
        name: 'Inventory',
        href: '/inventory',
        icon: Archive,
    },
    {
        name: 'Topo Logic',
        href: '/topo',
        icon: Network,
    },
    {
        name: 'Machine Learning',
        href: '/machine',
        icon: BrainCircuit,
    },
    {
        name: 'File Support',
        href: '/file-support',
        icon: FileText,
    }
];

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(true);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
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
        <div className={`hidden md:flex flex-col bg-white text-gray-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} h-screen border-r border-gray-200`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {!collapsed && (
                    <h2 className="text-xl font-bold">
                        <span className="font-bold text-blue-900">NEC</span>
                        <span className="font-normal text-orange-500"> Suite</span>
                    </h2>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
                >
                    {collapsed ? (
                        <ChevronRightIcon className="h-5 w-5" />
                    ) : (
                        <ChevronLeftIcon className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-visible mt-6">
                <ul className="space-y-2 px-3">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name} className="relative">
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    data-nav-item={item.name}
                                    onMouseEnter={() => collapsed && setHoveredItem(item.name)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} ${isActive ? 'text-blue-600' : 'text-gray-600'
                                        }`} />
                                    {!collapsed && (
                                        <span>{item.name}</span>
                                    )}
                                </Link>

                                {/* Custom Tooltip */}
                                {collapsed && hoveredItem === item.name && (
                                    <div className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap z-[9999] shadow-xl">
                                        {item.name}
                                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-gray-800"></div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Configuración y Logout */}
            <nav className="mt-6 mb-4">
                <ul className="space-y-2 px-3">
                    <li className="relative">
                        <Link
                            href="/admin"
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/settings'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            onMouseEnter={() => collapsed && setHoveredItem('Configuración')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Settings className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} ${pathname === '/settings' ? 'text-blue-600' : 'text-gray-600'
                                }`} />
                            {!collapsed && <span>Configuración</span>}
                        </Link>

                        {collapsed && hoveredItem === 'Configuración' && (
                            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap z-[9999] shadow-xl">
                                Configuración
                                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-gray-800"></div>
                            </div>
                        )}
                    </li>
                    <li className="relative">
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 w-full"
                            onMouseEnter={() => collapsed && setHoveredItem('Cerrar sesión')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <LogOut className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} text-gray-600`} />
                            {!collapsed && <span>Cerrar sesión</span>}
                        </button>

                        {collapsed && hoveredItem === 'Cerrar sesión' && (
                            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap z-[9999] shadow-xl">
                                Cerrar sesión
                                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-gray-800"></div>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>

            {/* Footer */}
            {!collapsed && (
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">U</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Usuario</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}