import { Server, Wifi, Shield, Router } from 'lucide-react';
import { NetworkDevice } from '@/types';
import { EmptyCell } from './EmptyCell';

interface NetworkDevicesTabProps {
    devices: NetworkDevice[];
    loading: boolean;
    error: string | null;
}

export const NetworkDevicesTab = ({ devices, loading, error }: NetworkDevicesTabProps) => {
    const normalizeDevice = (device: NetworkDevice) => {
        return {
            ...device,
            brand: device.brand === 'JUNOS' ? 'Juniper' : device.brand,
            type: device.type || 'other',
            version: device.version.replace(/[\[\],]/g, '').trim(),
            sn: device.serial_number ? device.serial_number.trim() : '',
            hostname: device.hostname || <EmptyCell />
        };
    };

    const normalizedDevices = devices.map(normalizeDevice);

    if (loading) return <div className="p-6">Cargando equipos...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
    if (!normalizedDevices.length) return <div className="p-6">No se encontraron equipos</div>;

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Equipos de Red Registrados
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Total de {normalizedDevices.length} equipos en la red
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hostname</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Versión</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {normalizedDevices.map((device) => (
                                <tr key={device.id} className="hover:bg-gray-50">
                                    {/* IP */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {device.ip ? (
                                            <div className="text-sm font-medium text-gray-900">{device.ip}</div>
                                        ) : <EmptyCell />}
                                        <div className="text-xs text-gray-500">
                                            {device.timestamp ? new Date(device.timestamp).toLocaleString() : <EmptyCell />}
                                        </div>
                                    </td>

                                    {/* Marca */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {device.brand ? (
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${device.brand === 'Juniper' ? 'bg-blue-100 text-blue-800' :
                                                device.brand === 'Huawei' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {device.brand}
                                            </span>
                                        ) : <EmptyCell />}
                                    </td>

                                    {/* Hostname */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {device.hostname ? (
                                            <div className="text-sm font-medium text-gray-900">{device.hostname}</div>
                                        ) : <EmptyCell />}
                                    </td>

                                    {/* Modelo */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {device.model ? (
                                            <span className="text-gray-900">{device.model}</span>
                                        ) : <EmptyCell />}
                                    </td>

                                    {/* Tipo */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {device.type ? (
                                            <div className="flex items-center">
                                                {device.type === 'router' && <Router className="h-4 w-4 mr-2 text-blue-500" />}
                                                {device.type === 'switch' && <Server className="h-4 w-4 mr-2 text-green-500" />}
                                                <span className="text-sm text-gray-900 capitalize">
                                                    {device.type}
                                                </span>
                                            </div>
                                        ) : <EmptyCell />}
                                    </td>

                                    {/* Versión */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {device.version ? (
                                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                {device.version.replace(/[\[\],]/g, '').trim()}
                                            </code>
                                        ) : <EmptyCell />}
                                    </td>

                                    {/* Número de serie */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {device.serial_number ? (
                                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                {device.sn.trim()}
                                            </code>
                                        ) : <EmptyCell />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};