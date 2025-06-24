'use client';

import { useMemo, useState } from 'react';
import { Server, Router } from 'lucide-react';
import Link from 'next/link';
import { Device } from '@/types/device';
import { FormSelect } from '@/src/ui/FormSelect';
import { FormInput } from '@/src/ui/FormInput';

interface NetworkDevicesTabProps {
    devices: Device[];
}

const PAGE_SIZE = 5;

export const NetworkDevicesTab = ({ devices }: NetworkDevicesTabProps) => {
    const [brandFilter, setBrandFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [ipFilter, setIpFilter] = useState('');
    const [page, setPage] = useState(1);

    const filteredDevices = useMemo(() => {
        return devices.filter((device) => {
            const brand = device.brand === 'JUNOS' ? 'Juniper' : device.brand || '';
            const matchesBrand = brandFilter ? brand === brandFilter : true;
            const matchesType = typeFilter ? device.type === typeFilter : true;
            const matchesIp = ipFilter ? device.ip?.includes(ipFilter) : true;
            return matchesBrand && matchesType && matchesIp;
        });
    }, [devices, brandFilter, typeFilter, ipFilter]);

    const totalPages = Math.ceil(filteredDevices.length / PAGE_SIZE);
    const paginatedDevices = filteredDevices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const uniqueBrands = Array.from(new Set(devices.map(d => d.brand === 'JUNOS' ? 'Juniper' : d.brand).filter(Boolean))).sort();
    const uniqueTypes = Array.from(new Set(devices.map(d => d.type).filter(Boolean))).sort();

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Equipos de Red Registrados
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Mostrando {paginatedDevices.length} de {filteredDevices.length} equipos
                    </p>
                </div>

                {/* Filtros */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormSelect
                        label="Filtrar por marca"
                        value={brandFilter}
                        onChange={e => {
                            setBrandFilter(e.target.value);
                            setPage(1); // Opcional: reinicia paginación al filtrar
                        }}
                        options={uniqueBrands}
                        placeholder="Todas las marcas"
                    />
                    <FormSelect
                        label="Filtrar por tipo"
                        value={typeFilter}
                        onChange={e => {
                            setTypeFilter(e.target.value);
                            setPage(1);
                        }}
                        options={uniqueTypes}
                        placeholder="Todos los tipos"
                    />

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Filtrar por IP</label>
                        <input type="text" className="w-full p-2 border rounded" value={ipFilter} onChange={e => setIpFilter(e.target.value)} placeholder="Buscar IP..." />
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hostname</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Versión</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Logs</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedDevices.length > 0 ? (
                                paginatedDevices.map((device, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">
                                            <div>{device.ip || '-'}</div>
                                            <div className="text-xs text-gray-500">{device.timestamp ? new Date(device.timestamp).toLocaleString() : '-'}</div>
                                        </td>
                                        <td className="px-4 py-2">{device.brand === 'JUNOS' ? 'Juniper' : device.brand || '-'}</td>
                                        <td className="px-4 py-2">{device.hostname || '-'}</td>
                                        <td className="px-4 py-2">{device.model || '-'}</td>
                                        <td className="px-4 py-2 flex items-center">
                                            {device.type === 'router' && <Router className="h-4 w-4 mr-2 text-blue-500" />}
                                            {device.type === 'switch' && <Server className="h-4 w-4 mr-2 text-green-500" />}
                                            {device.type || '-'}
                                        </td>
                                        <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">{device.version?.replace(/[\[\],]/g, '').trim() || '-'}</code></td>
                                        <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">{device.serial_number?.trim() || '-'}</code></td>
                                        <td className="px-4 py-2">
                                            <Link href={`/inventory/${device.ip}`} className="text-blue-600 hover:text-blue-800">
                                                Ver equipo
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center px-6 py-10 text-gray-600">
                                        No hay dispositivos encontrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="px-6 py-4 flex justify-between items-center border-t text-sm text-gray-600">
                    <div>
                        Página {page} de {totalPages}
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
