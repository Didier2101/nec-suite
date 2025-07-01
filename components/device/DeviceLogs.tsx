'use client';

import React, { useState, useEffect } from 'react';
import { DeviceLog, LogLevel } from '@/types/device';
import LogLevelTabs from './LogLevelTabs';
import Pagination from '@/src/ui/Pagination';

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
    const [expandedLogs, setExpandedLogs] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [logsPerPage, setLogsPerPage] = useState(10);

    useEffect(() => {
        let result = [...logs];
        if (selectedLevel !== 'all') {
            result = result.filter(log => log.log_level === selectedLevel);
        }
        setFilteredLogs(result);
        setCurrentPage(1);
    }, [logs, selectedLevel]);

    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
    const currentLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

    const toggleExpand = (logId: number) => {
        setExpandedLogs(prev =>
            prev.includes(logId) ? prev.filter(id => id !== logId) : [...prev, logId]
        );
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
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
            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by log level:</label>
                <LogLevelTabs selected={selectedLevel} onChange={setSelectedLevel} />
                <div className="mt-3 text-sm text-gray-600 flex justify-between items-center">
                    <span>
                        Showing {currentLogs.length} of {filteredLogs.length} logs
                        {selectedLevel !== 'all' && ` • Level: ${selectedLevel.toUpperCase()}`}
                    </span>
                    <div className="flex items-center">
                        <label htmlFor="perPage" className="mr-2">Logs per page:</label>
                        <select
                            id="perPage"
                            value={logsPerPage}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                setCurrentPage(1);
                                setLogsPerPage(value);
                            }}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SSH IP</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SSH Port</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                </table>

                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        {logs.length === 0
                                            ? 'No logs available'
                                            : 'No logs match the current filters'}
                                    </td>
                                </tr>
                            ) : (
                                currentLogs.map((log) => (
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
                                                    {expandedLogs.includes(log.id) ? 'Hide' : 'Details'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedLogs.includes(log.id) && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Full Info:</h4>
                                                            <pre className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                                                                {JSON.stringify(log, null, 2)}
                                                            </pre>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Full Event:</h4>
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

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
