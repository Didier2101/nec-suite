'use client';

import { User } from '@/types/users';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importar locale español
import { User as UserIcon, Mail, Shield, Calendar, Clock, X } from 'lucide-react';

// Configurar locale español
dayjs.locale('es');

interface UserDetailProps {
    user: User;
    onClose: () => void;
    onUserUpdated?: () => void;
}

export default function UserDetail({ user, onClose, onUserUpdated }: UserDetailProps) {
    // Función para formatear fechas con dayjs
    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('D [de] MMMM [de] YYYY, h:mm A');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative border border-gray-200">
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>

                {/* Encabezado */}
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserIcon className="h-6 w-6 text-blue-600" />
                        Detalles del Usuario
                    </h2>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-6">
                    {/* Información básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                Nombre Completo
                            </h3>
                            <p className="text-sm text-gray-900">{user.name}</p>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Correo Electrónico
                            </h3>
                            <p className="text-sm text-gray-900">{user.email}</p>
                        </div>

                        {/* Rol */}
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Rol
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                <Shield className="h-3 w-3 mr-1" />
                                {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                            </span>
                        </div>

                        {/* Fecha de registro */}
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Fecha de Registro
                            </h3>
                            <p className="text-sm text-gray-900">
                                {formatDate(user.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Historial de sesiones */}
                    <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Historial de Sesiones
                        </h3>

                        {user.sessions?.length ? (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Inicio
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fin
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {user.sessions.map((session) => (
                                            <tr key={session.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(session.timeInit)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {session.timeEnd
                                                        ? formatDate(session.timeEnd)
                                                        : 'Activa'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-400">
                                <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                <p>No hay sesiones registradas</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}