import React, { useState } from 'react';
import { Terminal, RefreshCw, Power, Download, HardDrive, Shield, Settings, Wifi } from 'lucide-react';

// Tipos necesarios
interface Device {
    id: string;
    name: string;
    credentials?: {
        username: string;
        password: string;
    };
    // Agrega más propiedades según tu estructura de datos
}

interface NetworkInterface {
    name: string;
    status: 'up' | 'down' | 'testing';
    ip_address?: string;
    description?: string;
}

interface Backup {
    id: string;
    timestamp: string;
    size: string;
    type: 'auto' | 'manual';
}

interface Log {
    source: string;
    message: string;
    timestamp: string;
    level: string;
}

type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

interface DeviceConfigProps {
    device: Device;
    logs?: Log[];
    interfaces?: NetworkInterface[];
    backups?: Backup[];
    onAction?: (action: string, params?: any) => Promise<void>;
}

export default function DeviceConfig({
    device,
    logs = [],
    interfaces = [],
    backups = [],
    onAction
}: DeviceConfigProps) {
    // Estados locales
    const [showPassword, setShowPassword] = useState(false);
    const [config, setConfig] = useState('# Configuración del equipo\n# Edite los parámetros según sea necesario\n\ninterface eth0\n  ip address 192.168.1.1/24\n  no shutdown\n\ninterface eth1\n  ip address dhcp\n  no shutdown');
    const [terminalCommand, setTerminalCommand] = useState('');
    const [actionStatus, setActionStatus] = useState<Record<string, ActionStatus>>({
        reboot: 'idle',
        shutdown: 'idle',
        backup: 'idle',
        update_firmware: 'idle',
        change_password: 'idle',
        test_connection: 'idle',
        save_config: 'idle',
        load_config: 'idle',
        apply_config: 'idle',
        execute_command: 'idle'
    });

    // Función para ejecutar acciones
    const performAction = async (action: string, params?: any) => {
        setActionStatus(prev => ({ ...prev, [action]: 'loading' }));

        try {
            if (onAction) {
                await onAction(action, params);
                setActionStatus(prev => ({ ...prev, [action]: 'success' }));
            }

            // Reset status después de 3 segundos
            setTimeout(() => {
                setActionStatus(prev => ({ ...prev, [action]: 'idle' }));
            }, 3000);
        } catch (error) {
            setActionStatus(prev => ({ ...prev, [action]: 'error' }));
            setTimeout(() => {
                setActionStatus(prev => ({ ...prev, [action]: 'idle' }));
            }, 3000);
        }
    };

    const executeCommand = () => {
        if (terminalCommand.trim()) {
            performAction('execute_command', { command: terminalCommand });
            setTerminalCommand('');
        }
    };

    return (
        <div className="space-y-6">
            {/* Panel de Acciones Rápidas */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Terminal className="h-5 w-5 mr-2 text-blue-600" />
                    Acciones de Gestión
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => performAction('reboot')}
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
                        onClick={() => performAction('shutdown')}
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
                        onClick={() => performAction('backup')}
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
                        onClick={() => performAction('update_firmware')}
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
                            onClick={() => performAction('change_password')}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                            Cambiar Contraseña
                        </button>
                        <button
                            onClick={() => performAction('test_connection')}
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
                            onClick={() => performAction('save_config', { config })}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                            Guardar Cambios
                        </button>
                        <button
                            onClick={() => performAction('load_config')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                        >
                            Cargar Configuración
                        </button>
                    </div>
                    <button
                        onClick={() => performAction('apply_config', { config })}
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
                                            onClick={() => performAction(`configure_interface_${intf.name}`)}
                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                        >
                                            Config
                                        </button>
                                        <button
                                            onClick={() => performAction(`interface_stats_${intf.name}`)}
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
                        onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                    />
                    <button
                        onClick={executeCommand}
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
                                    onClick={() => performAction(`download_backup_${backup.id}`)}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200"
                                >
                                    Descargar
                                </button>
                                <button
                                    onClick={() => performAction(`restore_backup_${backup.id}`)}
                                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200"
                                >
                                    Restaurar
                                </button>
                            </div>
                        </div>
                    ))}                </div>
            </div>
        </div>
    )
}