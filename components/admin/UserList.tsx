// src/components/admin/UserList.tsx
'use client';

import { useEffect, useState } from 'react';
import { MoreHorizontal, User as UserIcon, Mail, Shield, Trash2, Eye, Plus } from 'lucide-react';
import { User } from '@/types/users';

interface UserListProps {

    users: User[];
}

export default function UserList({ users }: UserListProps) {
    // console.log('Usuarios recibidos:', users);



    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h2>
            </div>


            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                                <div className="flex items-center">
                                    <UserIcon className="h-4 w-4 mr-2" />
                                    Nombre
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Correo
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Rol
                                </div>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users?.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            <Shield className="h-3 w-3 mr-1" />
                                            {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative inline-block text-left">
                                            <button
                                                type="button"
                                                // onClick={() => toggleDropdown(user.id)}
                                                className="inline-flex justify-center w-full rounded-md px-2 py-1 text-sm font-medium hover:bg-gray-100"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>

                                            {/* {dropdownOpen === user.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => {
                                                                onUserSelected(user);
                                                                setDropdownOpen(null);
                                                            }}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Ver detalles
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                // handleDelete(user.id);
                                                                setDropdownOpen(null);
                                                            }}
                                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            )} */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    No hay usuarios registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}