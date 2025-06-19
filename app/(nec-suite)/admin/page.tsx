// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { User, Shield, Users, Plus, Settings } from 'lucide-react';
// import UserForm from '@/components/admin/UserForm';
import UserList from '@/components/admin/UserList';
import { User as UserType } from '@/types/users';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'new_user'>('users');
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/users');
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUserDeleted = (id: number) => {
        setUsers(users.filter(user => user.id !== id));
    };

   const tabs = [
        { id: 'users', name: 'Lista de Usuarios', icon: Users },
        { id: 'new_user', name: 'Nuevo usuario', icon: Plus },
        { id: 'roles', name: 'Roles y Permisos', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <User className="mr-3 h-8 w-8 text-blue-600" />
                                Panel de Administración
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Gestión completa de usuarios y permisos del sistema
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                                >
                                    <Icon className="h-5 w-5 mr-2" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {/* {showForm && (
                    <UserForm
                        onClose={() => setShowForm(false)}
                        onSuccess={(newUser) => {
                            setShowForm(false);
                            setUsers([...users, newUser]);
                        }}
                    />
                )} */}

                {activeTab === 'users' && (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <UserList
                            onUserSelected={setSelectedUser}
                            onUserDeleted={handleUserDeleted}
                            onCreateUser={() => setShowForm(true)}
                        />
                    </div>
                )}

                {activeTab === 'roles' && (
                    <div className="bg-white shadow rounded-lg overflow-hidden p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Roles y Permisos</h2>
                        <p className="text-gray-600">Gestión de roles y permisos del sistema (en desarrollo)</p>
                    </div>
                )}

                {activeTab === 'new_user' && (
                    <div className="bg-white shadow rounded-lg overflow-hidden p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Nuevo usuario</h2>
                        <p className="text-gray-600">Ajustes de configuración del panel de administración (en desarrollo)</p>
                    </div>
                )}
            </div>
        </div>
    );
}