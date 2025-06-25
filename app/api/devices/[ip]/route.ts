import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { ip: string } }) {
    try {
        // CAMBIO AQUÍ: Aplica await directamente a la desestructuración de params
        // Aunque params sea de tipo { ip: string }, Next.js te lo pide así.
        const { ip } = await params;

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

        return NextResponse.json(deviceData);

    } catch (error) {
        console.error('Error en API route:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido' },
            { status: 500 }
        );
    }
}