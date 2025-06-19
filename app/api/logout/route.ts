// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Sesión cerrada correctamente' });

    // Elimina cookies relacionadas con sesión
    response.cookies.set('token', '', { path: '/', maxAge: 0 });
    response.cookies.set('username', '', { path: '/', maxAge: 0 });

    return response;
}
