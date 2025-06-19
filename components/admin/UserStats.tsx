// src/components/admin/UserStats.tsx
'use client';

import { User } from '@/types/users';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User as UserIcon, Shield, MailCheck } from 'lucide-react';

interface UserStatsProps {
    users: User[];
    loading: boolean;
    error: string | null;
}

export default function UserStats({ users, loading, error }: UserStatsProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    // Preparar datos para el gráfico
    const roleData = [
        { name: 'Administradores', count: users.filter(u => u.role === 'ADMIN').length },
        { name: 'Usuarios', count: users.filter(u => u.role === 'USER').length },
    ];

    return (
        <div className="space-y-6">
            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Administradores</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.role === 'ADMIN').length}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <Shield className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Usuarios Regulares</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.role === 'USER').length}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <MailCheck className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Distribución de Usuarios por Rol</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={roleData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}