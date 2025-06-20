"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Info, FileText, Settings, Power, RefreshCw, Download, Upload, Terminal, Shield, Wifi, HardDrive, Cpu } from 'lucide-react';

interface Device {
    brand: string;
    hostname: string;
    id: number;
    ip: string;
    model: string;
    serial_number: string;
    timestamp: string;
    type: string;
    version: string;
    status?: 'online' | 'offline' | 'degraded';
    last_backup?: string;
    credentials?: {
        username: string;
        password: string;
    };
}

interface Log {
    timestamp: string;
    level: string;
    message: string;
    source: string;
    device_id: number;
}

interface Interface {
    name: string;
    status: 'up' | 'down' | 'testing';
    ip_address?: string;
    description?: string;
}

interface Backup {
    id: number;
    timestamp: string;
    size: string;
    type: 'manual' | 'auto';
}

export default function DeviceDetailsPage() {
    const router = useRouter();
    const params = useParams();
    console.log('params:', params); // Debugging log

    const deviceIp = params.ip as string;

    const [device, setDevice] = useState<Device | null>(null);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'logs' | 'config'>('info');
    const [config, setConfig] = useState('');
    const [interfaces, setInterfaces] = useState<Interface[]>([]);
    const [backups, setBackups] = useState<Backup[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [actionStatus, setActionStatus] = useState<{ [key: string]: 'idle' | 'loading' | 'success' | 'error' }>({});
    const [terminalCommand, setTerminalCommand] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!deviceIp) {
                setError('IP de dispositivo no proporcionada.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/devices/${deviceIp}`);

                if (!response.ok) {
                    throw new Error(`Error al obtener datos del dispositivo: ${response.status}`);
                }

                const data = await response.json();
                console.log('Datos del dispositivo:', data); // Debugging log

                if (!data) {
                    throw new Error('No se encontraron datos para este dispositivo');
                }

                setDevice(data.device);
                setLogs(data.logs || []);

                // Si el backend también devuelve interfaces y backups, puedes usar:
                // setInterfaces(data.interfaces || []);
                // setBackups(data.backups || []);

                // Datos de ejemplo para interfaces
                setInterfaces([
                    { name: 'ge-0/0/0', status: 'up', ip_address: `${data.device.ip}/24`, description: 'Uplink to core' },
                    { name: 'ge-0/0/1', status: 'up', ip_address: '192.168.1.1/24', description: 'LAN segment' },
                    { name: 'ge-0/0/2', status: 'down' },
                    { name: 'ge-0/0/3', status: 'testing' },
                ]);

                // Datos de ejemplo para backups
                setBackups([
                    { id: 1, timestamp: new Date().toISOString(), size: '1.2 MB', type: 'auto' },
                    { id: 2, timestamp: new Date(Date.now() - 86400000).toISOString(), size: '1.1 MB', type: 'manual' },
                ]);

                // Configuración inicial
                setConfig(`# Configuración de ${data.device.hostname}
# Ejemplo de configuración
version ${data.device.version};
system {
    host-name ${data.device.hostname};
    time-zone America/Bogota;
    root-authentication {
        encrypted-password "$9$...";
    }
    services {
        ssh;
        netconf {
            ssh;
        }
    }
}
interfaces {
    ge-0/0/0 {
        unit 0 {
            family inet {
                address ${data.device.ip}/24;
            }
        }
    }
}`);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido al cargar los datos.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deviceIp]);

    // const performAction = async (action: string) => {
    //     setActionStatus(prev => ({ ...prev, [action]: 'loading' }));

    //     try {
    //         const response = await fetch(`/api/devices/${deviceIp}/actions`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ action }),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error al ejecutar acción: ${response.status}`);
    //         }

    //         const result = await response.json();

    //         setActionStatus(prev => ({ ...prev, [action]: 'success' }));

    //         // Actualizar logs
    //         const newLog: Log = {
    //             timestamp: new Date().toISOString(),
    //             level: 'INFO',
    //             message: result.message || `Acción '${action}' ejecutada correctamente`,
    //             source: 'web-ui',
    //             device_id: device?.id || 0
    //         };
    //         setLogs(prev => [newLog, ...prev]);

    //     } catch (err) {
    //         setActionStatus(prev => ({ ...prev, [action]: 'error' }));

    //         const newLog: Log = {
    //             timestamp: new Date().toISOString(),
    //             level: 'ERROR',
    //             message: err instanceof Error ? err.message : `Error al ejecutar acción '${action}'`,
    //             source: 'web-ui',
    //             device_id: device?.id || 0
    //         };
    //         setLogs(prev => [newLog, ...prev]);
    //     } finally {
    //         setTimeout(() => {
    //             setActionStatus(prev => ({ ...prev, [action]: 'idle' }));
    //         }, 3000);
    //     }
    // };

    // const executeCommand = async () => {
    //     if (!terminalCommand.trim() || !deviceIp) return;

    //     setActionStatus(prev => ({ ...prev, 'execute_command': 'loading' }));

    //     try {
    //         const response = await fetch(`/api/devices/${deviceIp}/commands`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ command: terminalCommand }),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error al ejecutar comando: ${response.status}`);
    //         }

    //         const result = await response.json();

    //         // Agregar resultado a los logs
    //         const newLog: Log = {
    //             timestamp: new Date().toISOString(),
    //             level: 'INFO',
    //             message: `Comando ejecutado: ${terminalCommand} - Resultado: ${result.output}`,
    //             source: 'cli',
    //             device_id: device?.id || 0
    //         };
    //         setLogs(prev => [newLog, ...prev]);

    //         setTerminalCommand('');
    //         setActionStatus(prev => ({ ...prev, 'execute_command': 'success' }));
    //     } catch (err) {
    //         setActionStatus(prev => ({ ...prev, 'execute_command': 'error' }));

    //         const newLog: Log = {
    //             timestamp: new Date().toISOString(),
    //             level: 'ERROR',
    //             message: err instanceof Error ? err.message : `Error al ejecutar comando`,
    //             source: 'cli',
    //             device_id: device?.id || 0
    //         };
    //         setLogs(prev => [newLog, ...prev]);
    //     } finally {
    //         setTimeout(() => {
    //             setActionStatus(prev => ({ ...prev, 'execute_command': 'idle' }));
    //         }, 3000);
    //     }
    // };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-xl text-gray-700">Cargando detalles del equipo...</p>
            </div>
        );
    }

    if (error || !device) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700 mb-2">
                        {error ? 'Error' : 'Equipo no encontrado'}
                    </h2>
                    <p className="text-gray-800">{error || 'El equipo solicitado no fue encontrado.'}</p>
                    <a href="/inventory" className="mt-4 inline-block text-blue-600 hover:underline">← Volver a Inventario</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <a href="/inventory" className="text-blue-600 hover:underline flex items-center">
                        <span className="mr-2">←</span> Volver a Inventario
                    </a>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Detalles de {device.hostname}
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${device.status === 'online' ? 'bg-green-100 text-green-800' : ''}
                            ${device.status === 'offline' ? 'bg-red-100 text-red-800' : ''}
                            ${device.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' : ''}`}>
                            {device.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                    </h1>
                    <div></div>
                </div>

                {/* Tabs de navegación */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`${activeTab === 'info'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                        >
                            <Info className="h-5 w-5 mr-2" />
                            Información
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`${activeTab === 'logs'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                        >
                            <FileText className="h-5 w-5 mr-2" />
                            Logs ({logs.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`${activeTab === 'config'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                        >
                            <Settings className="h-5 w-5 mr-2" />
                            Gestión
                        </button>
                    </nav>
                </div>

                {/* Contenido de las pestañas */}
                <div>
                    {activeTab === 'info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
                            <div className="p-4 bg-gray-50 rounded-md">
                                <p className="font-semibold">ID:</p>
                                <p>{device.id}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <p className="font-semibold">Marca:</p>
                                <p>{device.brand}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <p className="font-semibold">Hostname:</p>
                                <p>{device.hostname}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <p className="font-semibold">Modelo:</p>
                                <p>{device.model}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <p className="font-semibold">Dirección IP:</p>
                                <p>{device.ip}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <p className="font-semibold">Número de Serie:</p>
                                <p>{device.serial_number}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <p className="font-semibold">Tipo:</p>
                                <p>{device.type}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <p className="font-semibold">Versión:</p>
                                <p>{device.version}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md col-span-1 md:col-span-2">
                                <p className="font-semibold">Última Actualización:</p>
                                <p>{new Date(device.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div>
                            {logs.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Timestamp
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nivel
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Origen
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mensaje
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {logs.map((log, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${log.level === 'INFO' ? 'bg-green-100 text-green-800' : ''}
                                                            ${log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                            ${log.level === 'ERROR' ? 'bg-red-100 text-red-800' : ''}
                                                            ${log.level === 'CRITICAL' ? 'bg-purple-100 text-purple-800' : ''}
                                                            ${log.level === 'DEBUG' ? 'bg-blue-100 text-blue-800' : ''}
                                                        `}>
                                                            {log.level}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {log.source}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {log.message}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 p-4 bg-gray-50 rounded-md">No hay logs disponibles para este equipo.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'config' && (
                        <div className="space-y-6">
                            {/* Panel de Acciones Rápidas */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Terminal className="h-5 w-5 mr-2 text-blue-600" />
                                    Acciones de Gestión
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <button
                                        // onClick={() => performAction('reboot')}
                                        disabled={actionStatus['reboot'] === 'loading'}
                                        className={`p-3 rounded-md flex flex-col items-center justify-center transition-colors
                                            ${actionStatus['reboot'] === 'loading' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
                                            ${actionStatus['reboot'] === 'success' ? 'bg-green-100 text-green-800' : ''}
                                            ${actionStatus['reboot'] === 'error' ? 'bg-red-100 text-red-800' : ''}`}
                                    >
                                        <RefreshCw className={`h-6 w-6 mb-1 ${actionStatus['reboot'] === 'loading' ? 'animate-spin' : ''}`} />
                                        <span className="text-sm">Reiniciar</span>
                                    </button>
                                    <button
                                        // onClick={() => performAction('shutdown')}
                                        disabled={actionStatus['shutdown'] === 'loading'}
                                        className={`p-3 rounded-md flex flex-col items-center justify-center transition-colors
                                            ${actionStatus['shutdown'] === 'loading' ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-800 hover:bg-red-200'}
                                            ${actionStatus['shutdown'] === 'success' ? 'bg-green-100 text-green-800' : ''}
                                            ${actionStatus['shutdown'] === 'error' ? 'bg-red-100 text-red-800' : ''}`}
                                    >
                                        <Power className="h-6 w-6 mb-1" />
                                        <span className="text-sm">Apagar</span>
                                    </button>
                                    <button
                                        // onClick={() => performAction('backup')}
                                        disabled={actionStatus['backup'] === 'loading'}
                                        className={`p-3 rounded-md flex flex-col items-center justify-center transition-colors
                                            ${actionStatus['backup'] === 'loading' ? 'bg-gray-200 text-gray-600' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}
                                            ${actionStatus['backup'] === 'success' ? 'bg-green-100 text-green-800' : ''}
                                            ${actionStatus['backup'] === 'error' ? 'bg-red-100 text-red-800' : ''}`}
                                    >
                                        <Download className="h-6 w-6 mb-1" />
                                        <span className="text-sm">Backup</span>
                                    </button>
                                    <button
                                        // onClick={() => performAction('update_firmware')}
                                        disabled={actionStatus['update_firmware'] === 'loading'}
                                        className={`p-3 rounded-md flex flex-col items-center justify-center transition-colors
                                            ${actionStatus['update_firmware'] === 'loading' ? 'bg-gray-200 text-gray-600' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}
                                            ${actionStatus['update_firmware'] === 'success' ? 'bg-green-100 text-green-800' : ''}
                                            ${actionStatus['update_firmware'] === 'error' ? 'bg-red-100 text-red-800' : ''}`}
                                    >
                                        <HardDrive className="h-6 w-6 mb-1" />
                                        <span className="text-sm">Actualizar Firmware</span>
                                    </button>
                                </div>
                            </div>

                            {/* Credenciales de Acceso */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                                    Credenciales de Acceso
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Usuario</label>
                                        <input
                                            type="text"
                                            value={device.credentials?.username || ''}
                                            readOnly
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={device.credentials?.password || ''}
                                                readOnly
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 text-sm"
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
                                            >
                                                {showPassword ? 'Ocultar' : 'Mostrar'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 pt-2">
                                        <button
                                            // onClick={() => performAction('change_password')}
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            Cambiar Contraseña
                                        </button>
                                        <button
                                            // onClick={() => performAction('test_connection')}
                                            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                                        >
                                            Probar Conexión
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Configuración del Equipo */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Settings className="h-5 w-5 mr-2 text-blue-600" />
                                    Configuración del Equipo
                                </h3>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md resize-y min-h-[200px] font-mono text-sm bg-gray-50"
                                    value={config}
                                    onChange={(e) => setConfig(e.target.value)}
                                    spellCheck="false"
                                />
                                <div className="flex justify-between mt-3">
                                    <div className="flex space-x-2">
                                        <button
                                            // onClick={() => performAction('save_config')}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            Guardar Cambios
                                        </button>
                                        <button
                                            // onClick={() => performAction('load_config')}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                                        >
                                            Cargar Configuración
                                        </button>
                                    </div>
                                    <button
                                        // onClick={() => performAction('apply_config')}
                                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                    >
                                        Aplicar Configuración
                                    </button>
                                </div>
                            </div>

                            {/* Interfaces de Red */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Wifi className="h-5 w-5 mr-2 text-blue-600" />
                                    Interfaces de Red
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interfaz</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección IP</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {interfaces.map((intf, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{intf.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${intf.status === 'up' ? 'bg-green-100 text-green-800' : ''}
                                                            ${intf.status === 'down' ? 'bg-red-100 text-red-800' : ''}
                                                            ${intf.status === 'testing' ? 'bg-yellow-100 text-yellow-800' : ''}`}>
                                                            {intf.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{intf.ip_address || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{intf.description || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button
                                                            // onClick={() => performAction(`configure_interface_${intf.name}`)}
                                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                                        >
                                                            Config
                                                        </button>
                                                        <button
                                                            // onClick={() => performAction(`interface_stats_${intf.name}`)}
                                                            className="text-gray-600 hover:text-gray-900"
                                                        >
                                                            Estadísticas
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Terminal de Comandos */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Terminal className="h-5 w-5 mr-2 text-blue-600" />
                                    Terminal de Comandos
                                </h3>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={terminalCommand}
                                        onChange={(e) => setTerminalCommand(e.target.value)}
                                        placeholder="Ingrese comando..."
                                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                                    // onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                                    />
                                    <button
                                        // onClick={executeCommand}
                                        disabled={actionStatus['execute_command'] === 'loading'}
                                        className={`px-4 py-2 rounded-r-md hover:bg-blue-700
                                            ${actionStatus['execute_command'] === 'loading' ? 'bg-blue-400' : 'bg-blue-600 text-white'}`}
                                    >
                                        {actionStatus['execute_command'] === 'loading' ? 'Ejecutando...' : 'Ejecutar'}
                                    </button>
                                </div>
                                <div className="mt-3 p-3 bg-black text-green-400 font-mono text-sm rounded-md h-48 overflow-y-auto">
                                    {logs
                                        .filter(log => log.source === 'cli' || log.source === 'web-ui')
                                        .slice(0, 10)
                                        .map((log, idx) => (
                                            <div key={idx} className="mb-1">
                                                <span className="text-gray-400">$ </span>
                                                <span>{log.message}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Historial de Backups */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Download className="h-5 w-5 mr-2 text-blue-600" />
                                    Historial de Backups
                                </h3>
                                <div className="space-y-3">
                                    {backups.map((backup) => (
                                        <div key={backup.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                                            <div>
                                                <p className="font-medium">Backup #{backup.id}</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(backup.timestamp).toLocaleString()} • {backup.size} • {backup.type === 'auto' ? 'Automático' : 'Manual'}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    // onClick={() => performAction(`download_backup_${backup.id}`)}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200"
                                                >
                                                    Descargar
                                                </button>
                                                <button
                                                    // onClick={() => performAction(`restore_backup_${backup.id}`)}
                                                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200"
                                                >
                                                    Restaurar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}