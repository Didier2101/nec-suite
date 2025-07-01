import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Hacer la solicitud a Flask para obtener la lista de archivos
        const flaskResponse = await fetch('http://192.168.2.47:5000/api/list-converted');

        if (!flaskResponse.ok) {
            throw new Error(`Flask API error: ${flaskResponse.status}`);
        }

        const data = await flaskResponse.json();
        // console.log('Datos obtenidos de Flask:', data);
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error en list-converted:', error);
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : 'Error al obtener lista de archivos'
            },
            { status: 500 }
        );
    }
}