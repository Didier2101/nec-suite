// networkDevices.ts - Datos simulados de equipos de red basados en tu estructura SQL

export interface NetworkDevice {
    id: string;
    timestamp: string;
    ip: string;
    brand: 'Juniper' | 'Cisco' | 'Huawei' | 'HP' | 'Dell' | 'Fortinet' | 'Ubiquiti';
    hostname: string;
    model: string;
    version: string;
    type: 'router' | 'switch' | 'firewall' | 'access-point' | 'server';
    sn: string;
    location?: string;
    status?: 'active' | 'inactive' | 'maintenance';
    uptime?: string;
    lastSeen?: string;
}

export const networkDevices: NetworkDevice[] = [
    {
        id: '001',
        timestamp: '2024-06-15T08:30:15.123Z',
        ip: '192.168.1.1',
        brand: 'Juniper',
        hostname: 'JUNIPER-MX-CORE-01',
        model: 'MX480',
        version: '20.4R3.8',
        type: 'router',
        sn: 'JN0MX480001',
        location: 'Data Center A - Rack 01',
        status: 'active',
        uptime: '124d 15h 32m',
        lastSeen: '2024-06-16T14:25:00.000Z'
    },
    {
        id: '002',
        timestamp: '2024-06-14T10:15:30.456Z',
        ip: '192.168.1.10',
        brand: 'Cisco',
        hostname: 'CISCO-C9300-SW-01',
        model: 'C9300-48T',
        version: '16.12.08',
        type: 'switch',
        sn: 'FCD2345G001',
        location: 'Data Center A - Rack 02',
        status: 'active',
        uptime: '89d 22h 18m',
        lastSeen: '2024-06-16T14:24:30.000Z'
    },
    {
        id: '003',
        timestamp: '2024-06-13T16:45:22.789Z',
        ip: '192.168.1.254',
        brand: 'Fortinet',
        hostname: 'FORTINET-FG-FW-01',
        model: 'FortiGate-600E',
        version: '7.2.8',
        type: 'firewall',
        sn: 'FGT600E001',
        location: 'DMZ - Rack 10',
        status: 'active',
        uptime: '156d 8h 45m',
        lastSeen: '2024-06-16T14:23:45.000Z'
    },
    {
        id: '004',
        timestamp: '2024-06-12T09:20:45.234Z',
        ip: '10.0.10.5',
        brand: 'Juniper',
        hostname: 'JUNIPER-EX-SW-02',
        model: 'EX3300-48T',
        version: '18.4R3.3',
        type: 'switch',
        sn: 'JN0EX330002',
        location: 'Floor 2 - IDF East',
        status: 'maintenance',
        uptime: '45d 12h 8m',
        lastSeen: '2024-06-16T13:15:20.000Z'
    },
    {
        id: '005',
        timestamp: '2024-06-11T14:55:18.567Z',
        ip: '172.16.50.100',
        brand: 'HP',
        hostname: 'HP-ARUBA-AP-01',
        model: 'Aruba AP-515',
        version: '8.10.0.8',
        type: 'access-point',
        sn: 'AP515001',
        location: 'Floor 3 - Conference Room A',
        status: 'active',
        uptime: '67d 3h 22m',
        lastSeen: '2024-06-16T14:20:12.000Z'
    },
    {
        id: '006',
        timestamp: '2024-06-10T11:30:33.890Z',
        ip: '192.168.2.50',
        brand: 'Cisco',
        hostname: 'CISCO-ISR4451-RTR-02',
        model: 'ISR4451',
        version: '16.09.08',
        type: 'router',
        sn: 'FGL234567001',
        location: 'Branch Office - Main Rack',
        status: 'active',
        uptime: '203d 19h 55m',
        lastSeen: '2024-06-16T14:22:18.000Z'
    },
    {
        id: '007',
        timestamp: '2024-06-09T13:25:12.123Z',
        ip: '10.10.10.20',
        brand: 'Huawei',
        hostname: 'HUAWEI-S5700-SW-03',
        model: 'S5700-28C-HI',
        version: 'V200R019C10SPC800',
        type: 'switch',
        sn: 'HW5700001',
        location: 'Floor 1 - IDF West',
        status: 'inactive',
        uptime: '12d 6h 33m',
        lastSeen: '2024-06-15T16:45:30.000Z'
    },
    {
        id: '008',
        timestamp: '2024-06-08T07:40:27.456Z',
        ip: '192.168.100.1',
        brand: 'Ubiquiti',
        hostname: 'UBNT-UDM-PRO-01',
        model: 'UDM-Pro',
        version: '3.2.9',
        type: 'router',
        sn: 'UDMPRO001',
        location: 'Small Office - Network Closet',
        status: 'active',
        uptime: '45d 11h 28m',
        lastSeen: '2024-06-16T14:18:45.000Z'
    }
];

// Funciones de utilidad para estadísticas
export const getDevicesByBrand = () => {
    const brandCount = networkDevices.reduce((acc, device) => {
        acc[device.brand] = (acc[device.brand] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(brandCount).map(([brand, count]) => ({
        brand,
        count,
        percentage: Math.round((count / networkDevices.length) * 100)
    }));
};

export const getDevicesByType = () => {
    const typeCount = networkDevices.reduce((acc, device) => {
        acc[device.type] = (acc[device.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCount).map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / networkDevices.length) * 100)
    }));
};

export const getDevicesByStatus = () => {
    const statusCount = networkDevices.reduce((acc, device) => {
        const status = device.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
        status,
        count,
        percentage: Math.round((count / networkDevices.length) * 100)
    }));
};

export const getDevicesAddedOverTime = () => {
    const devicesByMonth = networkDevices.reduce((acc, device) => {
        const date = new Date(device.timestamp);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(devicesByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({
            month,
            count,
            label: new Date(month + '-01').toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short'
            })
        }));
};

// Estadísticas generales
export const getNetworkStats = () => {
    const total = networkDevices.length;
    const active = networkDevices.filter(d => d.status === 'active').length;
    const maintenance = networkDevices.filter(d => d.status === 'maintenance').length;
    const inactive = networkDevices.filter(d => d.status === 'inactive').length;

    const brands = new Set(networkDevices.map(d => d.brand)).size;
    const locations = new Set(networkDevices.map(d => d.location)).size;

    return {
        total,
        active,
        maintenance,
        inactive,
        brands,
        locations,
        activePercentage: Math.round((active / total) * 100),
        maintenancePercentage: Math.round((maintenance / total) * 100),
        inactivePercentage: Math.round((inactive / total) * 100)
    };
};