import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Crear FormData para enviar a Flask
        const flaskFormData = new FormData();

        // Copiar todos los campos del formData original
        for (const [key, value] of formData.entries()) {
            flaskFormData.append(key, value);
        }

        // Hacer la solicitud a Flask
        console.log('Enviando request a Flask...');
        const flaskResponse = await fetch('http://192.168.2.47:5000/api/upload-quote', {
            method: 'POST',
            body: flaskFormData,
        });

        console.log('Respuesta de Flask:', flaskResponse.status, flaskResponse.statusText);

        if (!flaskResponse.ok) {
            const errorText = await flaskResponse.text();
            console.error('Error de Flask:', errorText);
            throw new Error(`Flask API error: ${flaskResponse.status} - ${errorText}`);
        }

        // Verificar si la respuesta es JSON
        const contentType = flaskResponse.headers.get('content-type');
        console.log('Content-Type de respuesta:', contentType);

        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await flaskResponse.text();
            console.error('Respuesta no es JSON:', responseText);
            throw new Error(`Respuesta no es JSON. Content-Type: ${contentType}`);
        }

        const data = await flaskResponse.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error en upload-quote:', error);
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        );
    }
}