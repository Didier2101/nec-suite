'use client';

import { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
} from '@tanstack/react-table';
import { Server, Router } from 'lucide-react';
import { NetworkDevice } from '@/types';
import { EmptyCell } from './EmptyCell';
import Link from 'next/link';

interface NetworkDevicesTabProps {
    devices: NetworkDevice[];
}

export const NetworkDevicesTab = ({ devices }: NetworkDevicesTabProps) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Normalizar los datos
    const data = useMemo(() => devices.map(device => ({
        id: device.id,
        ip: device.ip || '',
        brand: device.brand === 'JUNOS' ? 'Juniper' : device.brand || '',
        hostname: device.hostname || '',
        model: device.model || '',
        type: device.type || 'other',
        version: device.version?.replace(/[\[\],]/g, '').trim() || '',
        serial_number: device.serial_number ? device.serial_number.trim() : '',
        timestamp: device.timestamp || ''
    })), [devices]);

    // Definición de columnas
    const columns = useMemo<ColumnDef<typeof data[0]>[]>(
        () => [
            {
                accessorKey: 'ip',
                header: 'IP',
                cell: ({ row }) => (
                    <div>
                        {row.original.ip ? (
                            <div className="text-sm font-medium text-gray-900">{row.original.ip}</div>
                        ) : <EmptyCell />}
                        <div className="text-xs text-gray-500">
                            {row.original.timestamp ? new Date(row.original.timestamp).toLocaleString() : <EmptyCell />}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'brand',
                header: 'Marca',
                cell: ({ row }) => (
                    row.original.brand ? (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.original.brand === 'Juniper' ? 'bg-blue-100 text-blue-800' :
                            row.original.brand === 'Huawei' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {row.original.brand}
                        </span>
                    ) : <EmptyCell />
                ),
            },
            {
                accessorKey: 'hostname',
                header: 'Hostname',
                cell: ({ row }) => row.original.hostname || <EmptyCell />,
            },
            {
                accessorKey: 'model',
                header: 'Modelo',
                cell: ({ row }) => row.original.model || <EmptyCell />,
            },
            {
                accessorKey: 'type',
                header: 'Tipo',
                cell: ({ row }) => (
                    row.original.type ? (
                        <div className="flex items-center">
                            {row.original.type === 'router' && <Router className="h-4 w-4 mr-2 text-blue-500" />}
                            {row.original.type === 'switch' && <Server className="h-4 w-4 mr-2 text-green-500" />}
                            <span className="text-sm text-gray-900 capitalize">
                                {row.original.type}
                            </span>
                        </div>
                    ) : <EmptyCell />
                ),
            },
            {
                accessorKey: 'version',
                header: 'Versión',
                cell: ({ row }) => (
                    row.original.version ? (
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {row.original.version}
                        </code>
                    ) : <EmptyCell />
                ),
            },
            {
                accessorKey: 'serial_number',
                header: 'Serial',
                cell: ({ row }) => (
                    row.original.serial_number ? (
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {row.original.serial_number}
                        </code>
                    ) : <EmptyCell />
                ),
            },
            {
                id: 'actions',
                header: 'Logs',
                cell: ({ row }) => (
                    <Link href={`/nec-suite/inventory/${row.original.ip}`} className="text-blue-600 hover:text-blue-800">
                        Ver equipo
                    </Link>
                ),
            },
        ],
        []
    );

    // Configuración de la tabla
    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 4, // Mostrar 5 elementos por página
            },
        },
    });

    // Obtener valores únicos para los filtros select
    const brandOptions = useMemo(() => {
        const brands = new Set(devices.map(d => d.brand === 'JUNOS' ? 'Juniper' : d.brand).filter(Boolean));
        return Array.from(brands).sort();
    }, [devices]);

    const typeOptions = useMemo(() => {
        const types = new Set(devices.map(d => d.type).filter(Boolean));
        return Array.from(types).sort();
    }, [devices]);

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Equipos de Red Registrados
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Mostrando {table.getRowModel().rows.length} de {data.length} equipos
                    </p>
                </div>

                {/* Filtros */}
                <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Filtro por marca */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                            Filtrar por marca
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            value={(table.getColumn('brand')?.getFilterValue() as string) ?? ''}
                            onChange={e => {
                                table.getColumn('brand')?.setFilterValue(e.target.value || undefined);
                            }}
                        >
                            <option value="">Todas las marcas</option>
                            {brandOptions.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por tipo */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                            Filtrar por tipo
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            value={(table.getColumn('type')?.getFilterValue() as string) ?? ''}
                            onChange={e => {
                                table.getColumn('type')?.setFilterValue(e.target.value || undefined);
                            }}
                        >
                            <option value="">Todos los tipos</option>
                            {typeOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por IP */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                            Filtrar por IP
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Buscar IP..."
                            value={(table.getColumn('ip')?.getFilterValue() as string) ?? ''}
                            onChange={e => {
                                table.getColumn('ip')?.setFilterValue(e.target.value || undefined);
                            }}
                        />
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-24 text-center">


                                        <p
                                            className="px-4 py-2  text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Presiona el boton <span className='text-red-600 font-bold'>Actulizar</span> para ver todos los dispositivos
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Página{' '}
                        <span className="font-medium">
                            {table.getState().pagination.pageIndex + 1}
                        </span>{' '}
                        de{' '}
                        <span className="font-medium">
                            {table.getPageCount()}
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};