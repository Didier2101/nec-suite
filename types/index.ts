export interface NetworkDevice {
    id: number;
    ip: string;
    hostname: string;
    brand: string;
    model: string;
    type: 'router' | 'switch' | 'firewall' | 'access-point' | string;
    serial_number: string;
    timestamp: string;
    version: string;
}

export interface BrandData {
    brand: string;
    count: number;
    percentage: number;
}

export interface TypeData {
    type: string;
    count: number;
}

export interface TimelineData {
    label: string;
    count: number;
}