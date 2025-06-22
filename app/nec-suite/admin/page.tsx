// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { User, Shield, Users, Plus, Settings } from 'lucide-react';
// import UserForm from '@/components/admin/UserForm';
import UserList from '@/components/admin/UserList';
import { User as UserType } from '@/types/users';
import HeaderNecSuite from '@/src/ui/HeaderNecSuite';
import { TabsNavigation } from '@/src/ui/TabsNavigation';
import { userTabs } from '@/src/constants/tabs';

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


    return (
        <div className="min-h-screen">
            {/* Header */}
            <HeaderNecSuite
                title="Panel de Administración"
                description="Gestión completa de usuarios y permisos del sistema"
                Icon={User}
            />

            {/* Navigation Tabs */}
            <TabsNavigation
                tabs={userTabs}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as 'users' | 'new_user' | 'roles')}
            />
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
                    <UserList
                        onUserSelected={setSelectedUser}
                        onUserDeleted={handleUserDeleted}
                        onCreateUser={() => setShowForm(true)}
                    />
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