// src/utils/networkStats.ts

import { BrandData, NetworkDevice, TimelineData, TypeData } from "@/types/device";

export const calculateNetworkStats = (devices: NetworkDevice[]) => {
    const total = devices.length;
    const brands = new Set(devices.map(d => d.brand)).size;
    const routers = devices.filter(d => d.type === 'router').length;
    const switches = devices.filter(d => d.type === 'switch').length;

    return {
        total,
        brands,
        routers,
        switches,
        routersPercentage: total > 0 ? Math.round((routers / total) * 100) : 0,
        switchesPercentage: total > 0 ? Math.round((switches / total) * 100) : 0,
    };
};

// src/utils/networkStats.ts

export const calculateDevicesByBrand = (devices: NetworkDevice[]): BrandData[] => {
    const brandCounts: Record<string, number> = {};

    devices.forEach(device => {
        const brand = device.brand === 'JUNOS' ? 'Juniper' : device.brand;
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    return Object.entries(brandCounts).map(([brand, count]) => ({
        brand,
        count,
        percentage: Math.round((count / devices.length) * 100),
    }));
};


export const calculateDevicesByType = (devices: NetworkDevice[]): TypeData[] => {
    const typeCounts: Record<string, number> = {};

    devices.forEach(device => {
        const type = device.type || 'other';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count
    }));
};

export const calculateDevicesTimeline = (devices: NetworkDevice[]): TimelineData[] => {
    const timeline: Record<string, number> = {};

    devices.forEach(device => {
        const date = new Date(device.timestamp);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        timeline[monthYear] = (timeline[monthYear] || 0) + 1;
    });

    return Object.entries(timeline).map(([label, count]) => ({
        label,
        count
    }));
};

