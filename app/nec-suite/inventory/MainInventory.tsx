"use client";
import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { NetworkDashboard } from './NetworkDashboard';
import { NetworkDevicesTab } from './NetworkDevicesTab';
import { NetworkDevice } from '@/types';
import HeaderNecSuite from '@/src/ui/HeaderNecSuite';
import { TabsNavigation } from '@/src/ui/TabsNavigation';
import Swal from 'sweetalert2';
import { inventoryTabs } from '@/src/constants/tabs';
import Loading from '@/src/ui/Loading';

export const MainInventory = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'network'>('dashboard');
    const [devices, setDevices] = useState<NetworkDevice[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDeviceData = async () => {
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
        };
        fetchDeviceData();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <HeaderNecSuite
                title="Network Inventory Management"
                description="Gestión completa de equipos y recursos de red"
                Icon={Package}
            />



            <TabsNavigation
                tabs={inventoryTabs}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as 'dashboard' | 'network')}
                // onRefresh={fetchDeviceData}
                loading={loading}
            />



            {/* Contenido */}
            <div className="max-w-7xl mx-auto">
                {loading && <Loading text="Cargando equipos de red..." />}
                {!loading && activeTab === 'dashboard' && <NetworkDashboard devices={devices} />}
                {!loading && activeTab === 'network' && (
                    <NetworkDevicesTab devices={devices} />
                )}
            </div>
        </div>
    );
};
