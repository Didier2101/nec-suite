"use client"

import React, { useEffect, useState } from 'react';
import { TabsNavigation } from '@/src/ui/TabsNavigation';
import { settingsTabs } from '@/src/constants/tabs';
import DeviceLogs from './DeviceLogs'; // Importar el nuevo componente
import { Device, DeviceLog } from '@/types/device';
import Link from 'next/link';
import Loading from '@/src/ui/Loading';

export default function DeviceDetails({ deviceIp }: { deviceIp: string }) {
    const [activeTab, setActiveTab] = useState<'logs'>('logs');
    const [device, setDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<DeviceLog[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!deviceIp) {
                setError('IP de dispositivo no proporcionada.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/devices/${deviceIp}`);

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Verifica la estructura de los datos

                // Ajuste para manejar ambos formatos de respuesta
                const device = data.device || data;
                const logs = data.logs || [];

                if (!device) {
                    throw new Error('Datos del dispositivo no encontrados');
                }

                setDevice(device);
                setLogs(logs);

            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deviceIp]);

    if (loading) {
        return (
            <Loading text="Cargando detalles del dispositivo..." />
        );
    }

    if (error || !device) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700 mb-2">
                        {error ? 'Error' : 'Equipo no encontrado'}
                    </h2>
                    <p className="text-gray-800">{error || 'El equipo solicitado no fue encontrado.'}</p>
                    <Link href="/inventory" className="mt-4 inline-block text-blue-600 hover:underline">← Volver a Inventario</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/inventory" className="text-blue-600 hover:underline flex items-center">
                        <span className="mr-2">←</span> Volver a Inventario
                    </Link>
                    <h1 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight">
                        Detalles de {device.hostname || 'Dispositivo'}
                    </h1>
                </div>

                {/* Tabs de navegación */}
                <TabsNavigation
                    tabs={settingsTabs}
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as 'logs')}
                />

                {/* Contenido de las pestañas */}
                <div className="mt-6">
                    {/* {activeTab === 'info' && (
                        <InfoDevice device={device} />
                    )} */}

                    {activeTab === 'logs' && (
                        <DeviceLogs logs={logs} />
                    )}
                </div>

            </div>
        </div>
    );
}