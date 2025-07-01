"use client";
import { useEffect, useState, useCallback } from 'react';
import { NetworkDashboard } from './NetworkDashboard';
import { NetworkDevicesTab } from './NetworkDevicesTab';
import Swal from 'sweetalert2';
import { Device } from '@/types/device';
import { TabsNavigation } from '@/src/ui/TabsNavigation';
import { inventoryTabs } from '@/src/constants/tabs';

export const MainInventory = () => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'network'>('dashboard');
    const [devices, setDevices] = useState<Device[]>([]);

    // ✅ Esta función se reutiliza para inicial y actualización manual
    const fetchDeviceData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/devices');
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            setDevices(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            Swal.fire({
                icon: 'error',
                title: 'Error al obtener los dispositivos',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Solo una vez al montar
    useEffect(() => {
        fetchDeviceData();
    }, [fetchDeviceData]);

    return (
        <>
            <TabsNavigation
                tabs={inventoryTabs}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as 'dashboard' | 'network')}
                onRefresh={fetchDeviceData} // ✅ Botón recargar
                loading={loading}
            />

            {/* Contenido */}
            <div className=" p-6 w-full max-w-7xl mx-auto ">
                {loading && <p>Cargando equipos de red...</p>}
                {!loading && activeTab === 'dashboard' && <NetworkDashboard devices={devices} />}
                {!loading && activeTab === 'network' && (
                    <NetworkDevicesTab devices={devices} />
                )}
            </div>
        </>
    );
};
