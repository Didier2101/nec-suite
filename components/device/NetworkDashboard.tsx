
import { Activity, Server, Router, } from 'lucide-react';
import { StatCard } from './StatCard';
import { Device } from '@/types/device';
import { calculateDevicesByBrand, calculateDevicesByType, calculateDevicesTimeline, calculateNetworkStats } from '@/src/utils/network-dashboard-utils/functions';
import { NetworkChartSection } from './NetworkChartSection';


export const NetworkDashboard = ({ devices }: { devices: Device[] }) => {

    const stats = calculateNetworkStats(devices);
    const brandData = calculateDevicesByBrand(devices);
    const typeData = calculateDevicesByType(devices);
    const timelineData = calculateDevicesTimeline(devices);

    return (
        <div className="">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Activity className="mr-3 h-8 w-8 text-blue-600" />
                    Network Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                    Real-time statistics and metrics of network devices
                </p>

            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Devices"
                    value={stats.total}
                    icon={Server}
                    color="bg-blue-500"
                    subtitle={`${stats.brands} different brands`}
                />
                <StatCard
                    title="Routers"
                    value={stats.routers}
                    icon={Router}
                    color="bg-purple-500"
                    subtitle={`${stats.routersPercentage}% of the total`}
                />
                <StatCard
                    title="Switches"
                    value={stats.switches}
                    icon={Server}
                    color="bg-green-500"
                    subtitle={`${stats.switchesPercentage}% of the total`}
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