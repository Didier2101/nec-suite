// src/components/NetworkChartSection.tsx

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
    ResponsiveContainer
} from "recharts";

import { BrandData, TypeData, TimelineData } from "@/types/device";

const COLORS = {
    brands: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6B7280']
};

type Props = {
    brandData: BrandData[];
    typeData: TypeData[];
    timelineData: TimelineData[];
};

export const NetworkChartSection = ({ brandData, typeData, timelineData }: Props) => {
    return (
        <>
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
            <div className="bg-white rounded-lg shadow p-6 mt-6">
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
        </>
    );
};
