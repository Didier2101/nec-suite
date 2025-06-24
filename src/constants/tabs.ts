import { BarChart3, Activity, Users, Plus, Shield } from 'lucide-react';

export const inventoryTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'network', name: 'Equipos de Red', icon: Activity },
];

export const userTabs = [
    { id: 'users', name: 'Lista de Usuarios', icon: Users },
    { id: 'new_user', name: 'Nuevo usuario', icon: Plus },
    { id: 'roles', name: 'Roles y Permisos', icon: Shield },
];

export const settingsTabs = [
    // { id: 'info', name: 'Informacion', icon: Activity },
    { id: 'logs', name: 'logs', icon: Activity },
];
