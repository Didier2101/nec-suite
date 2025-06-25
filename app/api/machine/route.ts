// app/api/devices/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const machineResponse = await fetch('http://192.168.2.47:5008/api/anomalies');

        if (!machineResponse.ok) {
            throw new Error(`Error HTTP: ${machineResponse.status}`);
        }

        const dataMachine = await machineResponse.json();
        // console.log('Datos de la máquina:', dataMachine);
        return NextResponse.json(dataMachine);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido' },
            { status: 500 }
        );
    }
}
