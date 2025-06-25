"use client"

import { userTabs } from '@/src/constants/tabs';
import Loading from '@/src/ui/Loading';
import { TabsNavigation } from '@/src/ui/TabsNavigation';
import { User } from '@/types/users';
import React, { useEffect, useState } from 'react'
import UserList from './UserList';

export default function MainAdmin() {
    const [activeTab, setActiveTab] = useState<'users' | 'new_user' | 'roles'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/user_list');

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            // console.log('Usuarios recibidos desde API:', data);

            // Asegura que sea array
            setUsers(Array.isArray(data.users) ? data.users : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            alert('Error loading users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // const toggleDropdown = (userId: number) => {
    //     setDropdownOpen(dropdownOpen === userId ? null : userId);
    // };

    return (
        <>
            <TabsNavigation
                tabs={userTabs}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as 'users' | 'new_user' | 'roles')}
                // onRefresh={fetchDeviceData} // ✅ Botón recargar
                loading={loading}
            />

            {/* Contenido */}
            <div className="max-w-7xl mx-auto">
                {loading && <Loading text="Cargando usuarios..." />}
                {!loading && activeTab === 'users' && (
                    <UserList
                        users={users}
                    />
                )}
            </div>

        </>
    )
}
