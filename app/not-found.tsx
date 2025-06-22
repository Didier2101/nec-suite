"use client";

import React from 'react';
import Link from 'next/link';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Icono de error */}
                <div className="mb-8">
                    <AlertCircle className="h-24 w-24 text-blue-600 mx-auto mb-4" />
                    <div className="text-6xl font-bold text-gray-900 mb-2">404</div>
                </div>

                {/* Branding y mensaje principal */}
                <div className="mb-8">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-blue-600 mb-1">NEC SUITE</h2>
                        <div className="w-16 h-0.5 bg-blue-600 mx-auto"></div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Página no encontrada
                    </h1>
                    <p className="text-gray-600">
                        Lo sentimos, la página que estás buscando no existe o ha sido movida en nuestro sistema.
                    </p>
                </div>

                {/* Botones de acción */}
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                    >
                        <Home className="h-5 w-5 mr-2" />
                        Volver a NEC SUITE
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center font-medium"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Página anterior
                    </button>
                </div>

                {/* Información adicional */}
                <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">
                        Si crees que esto es un error en NEC SUITE, por favor contacta al administrador del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
}