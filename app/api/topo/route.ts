// app/api/devices/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const topoResponse = await fetch('http://192.168.2.101:5000/api/topology');

        if (!topoResponse.ok) {
            throw new Error(`Error HTTP: ${topoResponse.status}`);
        }

        const dataTopo = await topoResponse.json();
        return NextResponse.json(dataTopo);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido' },
            { status: 500 }
        );
    }
}
