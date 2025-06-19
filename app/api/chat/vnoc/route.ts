

// app/api/ask/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "Missing 'message' field" },
                { status: 400 }
            );
        }

        // Reemplaza con la URL de tu API Flask
        const flaskResponse = await fetch('http://192.168.2.47:5001/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!flaskResponse.ok) {
            throw new Error('Error al conectar con el servicio de consultas');
        }

        const data = await flaskResponse.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { sender: "bot", message: error instanceof Error ? error.message : 'Error desconocido' },
            { status: 500 }
        );
    }
}