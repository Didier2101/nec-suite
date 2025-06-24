import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { ip: string } }) {
    try {
        const { ip } = params; // No necesita await, ya no es Promise

        const flaskUrl = `http://192.168.2.47:5005/api/device_by_ip`;

        const flaskResponse = await fetch(flaskUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip })
        });

        if (!flaskResponse.ok) {
            return NextResponse.json(
                { error: `Error al obtener dispositivo: ${flaskResponse.statusText}` },
                { status: flaskResponse.status }
            );
        }

        const deviceData = await flaskResponse.json();

        // Devuelve directamente los datos de Flask sin envolverlos nuevamente
        return NextResponse.json(deviceData);

    } catch (error) {
        console.error('Error en API route:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido' },
            { status: 500 }
        );
    }
}