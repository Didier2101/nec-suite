// types/device.ts
export interface Device {
    deviceIp?: string;
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

// Nuevos tipos para logs
export type LogLevel = 'info' | 'warning' | 'error' | 'debug' | 'critical';


export interface DeviceLog {
    id: number;
    event: string;
    log_level: LogLevel;
    ip_address: string;
    ssh_ip: string | null;
    ssh_port: number | null;
    ssh_status: string | null;
    timestamp: string; // Formato ISO 8601
    device_id?: number; // opcional, ya que no está en todos los objetos
    source?: string;
    details?: string;
}

export interface LogsResponse {
    logs: DeviceLog[];
    total: number;
    page?: number;
    per_page?: number;
}