import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer
} from 'recharts';
import { Activity, Server, Router, Wifi, Shield } from 'lucide-react';
import { StatCard } from './StatCard';
import { NetworkDevice, BrandData, TypeData, TimelineData } from '@/types';

const COLORS = {
    primary: ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554'],
    brands: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6B7280']
};

export const NetworkDashboard = ({ devices }: { devices: NetworkDevice[] }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    // Funciones de cálculo
    const calculateNetworkStats = () => {
        const total = devices.length;
        const brands = new Set(devices.map(d => d.brand)).size;
        const routers = devices.filter(d => d.type === 'router').length;
        const switches = devices.filter(d => d.type === 'switch').length;

        return {
            total,
            brands,
            routers,
            switches,
            routersPercentage: Math.round((routers / total) * 100),
            switchesPercentage: Math.round((switches / total) * 100)
        };
    };

    const calculateDevicesByBrand = (): BrandData[] => {
        const brandCounts: Record<string, number> = {};

        devices.forEach(device => {
            const brand = device.brand === 'JUNOS' ? 'Juniper' : device.brand;
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
        });

        return Object.entries(brandCounts).map(([brand, count]) => ({
            brand,
            count,
            percentage: Math.round((count / devices.length) * 100)
        }));
    };

    const calculateDevicesByType = (): TypeData[] => {
        const typeCounts: Record<string, number> = {};

        devices.forEach(device => {
            const type = device.type || 'other';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        return Object.entries(typeCounts).map(([type, count]) => ({
            type,
            count
        }));
    };

    const calculateDevicesTimeline = (): TimelineData[] => {
        const timeline: Record<string, number> = {};

        devices.forEach(device => {
            const date = new Date(device.timestamp);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            timeline[monthYear] = (timeline[monthYear] || 0) + 1;
        });

        return Object.entries(timeline).map(([label, count]) => ({
            label,
            count
        }));
    };

    const stats = calculateNetworkStats();
    const brandData = calculateDevicesByBrand();
    const typeData = calculateDevicesByType();
    const timelineData = calculateDevicesTimeline();

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

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribución por Marca */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Distribución por Marca
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={brandData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ brand, percentage }) => `${brand} (${percentage}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {brandData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS.brands[index % COLORS.brands.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, 'Equipos']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Tipos de Equipos */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Tipos de Equipos
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={typeData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="type" type="category" width={100} />
                            <Tooltip formatter={(value) => [value, 'Equipos']} />
                            <Bar
                                dataKey="count"
                                fill="#8B5CF6"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Timeline Chart */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Equipos Agregados por Mes
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, 'Equipos']} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#06B6D4"
                            strokeWidth={3}
                            dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};