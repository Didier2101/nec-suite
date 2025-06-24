// InfoDevice.tsx
import React from 'react';
import { Device } from '@/types/device';

export default function InfoDevice({ device }: { device: Device }) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Información del Dispositivo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Identificación</h3>
                    <ul className="space-y-2">
                        <li><span className="font-medium">Hostname:</span> {device.hostname}</li>
                        <li><span className="font-medium">IP:</span> {device.ip}</li>
                        <li><span className="font-medium">Serial:</span> {device.serial_number}</li>
                    </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Hardware</h3>
                    <ul className="space-y-2">
                        <li><span className="font-medium">Marca:</span> {device.brand}</li>
                        <li><span className="font-medium">Modelo:</span> {device.model}</li>
                        <li><span className="font-medium">Tipo:</span> {device.type}</li>
                    </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Software</h3>
                    <ul className="space-y-2">
                        <li><span className="font-medium">Versión:</span> {device.version}</li>
                        <li><span className="font-medium">Última actualización:</span> {new Date(device.timestamp).toLocaleString()}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}