

// app/api/ask/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { username, query } = await request.json();

        if (!query) {
            return NextResponse.json(
                { error: "Missing 'message' field" },
                { status: 400 }
            );
        }

        // Reemplaza con la URL de tu API Flask
        const flaskResponse = await fetch('http://192.168.2.47:5002/api/rag_query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, query }),
        });

        if (!flaskResponse.ok) {
            throw new Error(`Error HTTP: ${flaskResponse.status}`);
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