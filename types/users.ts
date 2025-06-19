export interface Session {
    id: number;
    timeInit: string;
    timeEnd: string | null;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
    updatedAt: string;
    sessions?: Session[];
}