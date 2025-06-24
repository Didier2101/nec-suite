"use client";

import React, { useState, useEffect } from 'react';
import { DeviceLog, LogLevel } from '@/types/device';

interface DeviceLogsProps {
    logs: DeviceLog[];
}

const LogLevelBadge = ({ level }: { level: LogLevel }) => {
    const getColorClass = (level: LogLevel) => {
        switch (level) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'error':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'info':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'debug':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getColorClass(level)}`}>
            {level}
        </span>
    );
};

export default function DeviceLogs({ logs }: DeviceLogsProps) {
    const [filteredLogs, setFilteredLogs] = useState<DeviceLog[]>(logs);
    const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedLogs, setExpandedLogs] = useState<number[]>([]);

    const logLevels: (LogLevel | 'all')[] = ['all', 'critical', 'error', 'warning', 'info', 'debug'];

    useEffect(() => {
        let result = [...logs];

        if (selectedLevel !== 'all') {
            result = result.filter(log => log.log_level === selectedLevel);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(log =>
                log.event.toLowerCase().includes(term) ||
                (log.ssh_ip && log.ssh_ip.toLowerCase().includes(term)) ||
                (log.ssh_status && log.ssh_status.toLowerCase().includes(term))
            );
        }

        setFilteredLogs(result);
    }, [logs, selectedLevel, searchTerm]);

    const toggleExpand = (logId: number) => {
        setExpandedLogs(prev =>
            prev.includes(logId) ? prev.filter(id => id !== logId) : [...prev, logId]
        );
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div className="space-y-4">
            {/* Filtros */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por nivel:
                        </label>
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'all')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {logLevels.map(level => (
                                <option key={level} value={level}>
                                    {level === 'all' ? 'Todos los niveles' : level.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar en logs:
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por evento, SSH IP o estado..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                    Mostrando {filteredLogs.length} de {logs.length} logs
                    {selectedLevel !== 'all' && ` • Nivel: ${selectedLevel.toUpperCase()}`}
                    {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                </div>
            </div>

            {/* Tabla con scroll */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nivel
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha/Hora
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Evento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SSH IP
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Puerto SSH
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                </table>

                {/* Scroll solo en el cuerpo de la tabla */}
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        {logs.length === 0
                                            ? 'No hay logs disponibles'
                                            : 'No se encontraron logs que coincidan con los filtros'}
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <React.Fragment key={log.id}>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <LogLevelBadge level={log.log_level as LogLevel} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatTimestamp(log.timestamp)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                {log.event}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {log.ssh_ip || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {log.ssh_port || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => toggleExpand(log.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    {expandedLogs.includes(log.id) ? 'Ocultar' : 'Detalles'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedLogs.includes(log.id) && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Información completa:</h4>
                                                            <pre className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                                                                {JSON.stringify(log, null, 2)}
                                                            </pre>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Evento completo:</h4>
                                                            <div className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                                                                {log.event}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
