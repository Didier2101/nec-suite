
import { Activity, Server, Router, } from 'lucide-react';
import { StatCard } from './StatCard';
import { NetworkDevice } from '@/types/device';
import { calculateDevicesByBrand, calculateDevicesByType, calculateDevicesTimeline, calculateNetworkStats } from '@/src/utils/network-dashboard-utils/functions';
import { NetworkChartSection } from './NetworkChartSection';


export const NetworkDashboard = ({ devices }: { devices: NetworkDevice[] }) => {

    const stats = calculateNetworkStats(devices);
    const brandData = calculateDevicesByBrand(devices);
    const typeData = calculateDevicesByType(devices);
    const timelineData = calculateDevicesTimeline(devices);

    return (
        <div className="p-6 w-full max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Activity className="mr-3 h-8 w-8 text-blue-600" />
                    Network Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                    Estadísticas y métricas de equipos de red en tiempo real
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Equipos"
                    value={stats.total}
                    icon={Server}
                    color="bg-blue-500"
                    subtitle={`${stats.brands} marcas diferentes`}
                />
                <StatCard
                    title="Routers"
                    value={stats.routers}
                    icon={Router}
                    color="bg-purple-500"
                    subtitle={`${stats.routersPercentage}% del total`}
                />
                <StatCard
                    title="Switches"
                    value={stats.switches}
                    icon={Server}
                    color="bg-green-500"
                    subtitle={`${stats.switchesPercentage}% del total`}
                />
            </div>

            <NetworkChartSection
                brandData={brandData}
                typeData={typeData}
                timelineData={timelineData}
            />



        </div>
    );
};