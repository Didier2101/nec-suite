"use client"

import { useEffect, useState } from 'react';
import { Package, BarChart3, Activity } from 'lucide-react';
import { NetworkDashboard } from './NetworkDashboard';
import { NetworkDevicesTab } from './NetworkDevicesTab';
import { NetworkDevice } from '@/types';

interface MainInventoryProps {
    username?: string;
}

export const MainInventory = ({ username }: MainInventoryProps) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'network'>('dashboard');
    const [devices, setDevices] = useState<NetworkDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/devices');
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                setDevices(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchDeviceData();
    }, []);

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
        { id: 'network', name: 'Equipos de Red', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Package className="mr-3 h-8 w-8 text-blue-600" />
                                Network Inventory Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Gestión completa de equipos y recursos de red
                            </p>

                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="max-w-7xl mx-auto">
                {activeTab === 'dashboard' && <NetworkDashboard devices={devices} />}
                {activeTab === 'network' && (
                    <NetworkDevicesTab
                        devices={devices}
                        loading={loading}
                        error={error}
                    />
                )}
            </div>
        </div>
    );
};