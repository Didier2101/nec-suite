// app/api/admin/user_list/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const flaskResponse = await fetch('http://192.168.2.47:5000/api/users_list');

        if (!flaskResponse.ok) {
            throw new Error(`Error HTTP: ${flaskResponse.status}`);
        }

        const data = await flaskResponse.json();
        console.log('Datos de usuarios recibidos:', data);
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido' },
            { status: 500 }
        );
    }
}