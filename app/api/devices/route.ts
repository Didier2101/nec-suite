// app/api/devices/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const flaskResponse = await fetch('http://192.168.2.47:5005/api/device_list');

        if (!flaskResponse.ok) {
            throw new Error(`Error HTTP: ${flaskResponse.status}`);
        }

        const data = await flaskResponse.json();
        // console.log('data en la api', data)
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido' },
            { status: 500 }
        );
    }
}
