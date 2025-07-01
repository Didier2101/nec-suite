import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('file');

        if (!filename) {
            return NextResponse.json(
                { ok: false, error: 'Falta el nombre del archivo' },
                { status: 400 }
            );
        }

        // Hacer la solicitud a Flask para descargar el archivo
        const flaskResponse = await fetch(`http://192.168.2.47:5000/api/download-quote?file=${filename}`);

        if (!flaskResponse.ok) {
            const errorData = await flaskResponse.json().catch(() => ({ error: 'Archivo no encontrado' }));
            return NextResponse.json(errorData, { status: flaskResponse.status });
        }

        // Obtener el archivo como stream
        const fileStream = flaskResponse.body;
        const contentType = flaskResponse.headers.get('content-type') || 'application/octet-stream';
        const contentDisposition = flaskResponse.headers.get('content-disposition') || `attachment; filename="${filename}"`;

        return new NextResponse(fileStream, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': contentDisposition,
            },
        });

    } catch (error) {
        console.error('Error en download-quote:', error);
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        );
    }
}