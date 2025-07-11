import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    subtitle?: string;
}

export const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle
}: StatCardProps) => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>

                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}

            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
    </div>

);