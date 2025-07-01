import { BarChart3, Activity, Users, Plus, Shield } from 'lucide-react';

export const inventoryTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'network', name: 'Network Devices', icon: Activity },
];

export const userTabs = [
    { id: 'users', name: 'User List', icon: Users },
    { id: 'new_user', name: 'New User', icon: Plus },
    { id: 'roles', name: 'Roles & Permissions', icon: Shield },
];

export const settingsTabs = [
    // { id: 'info', name: 'Information', icon: Activity },
    { id: 'logs', name: 'Logs', icon: Activity },
];

export const topoLogicTabs = [
    // { id: 'info', name: 'Information', icon: Activity },
    { id: 'topologia', name: 'Topology', icon: Activity },
    { id: 'disenador', name: 'Network Designer', icon: Activity },
];
