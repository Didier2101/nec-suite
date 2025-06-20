// app/api/devices/[ip]/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ ip: string }> }) {
    try {
        const { ip } = await params;
        console.log('IP recibida:', ip);

        const flaskUrl = `http://192.168.2.47:5005/api/device_by_ip`;
        console.log('URL de Flask:', flaskUrl);

        const flaskResponse = await fetch(flaskUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip: ip })
        });
        console.log('Status de Flask:', flaskResponse.status);

        if (!flaskResponse.ok) {
            console.log('Error en Flask response:', flaskResponse.status, flaskResponse.statusText);
            throw new Error(`Error HTTP: ${flaskResponse.status}`);
        }

        const deviceData = await flaskResponse.json();
        console.log('Data recibida de Flask:', deviceData);

        // Envolver los datos en el formato que espera el frontend
        return NextResponse.json({
            device: deviceData,
            logs: [] // Por ahora vacío, puedes agregar logs después
        });

    } catch (error) {
        console.log('Error en API route:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido' },
            { status: 500 }
        );
    }
}