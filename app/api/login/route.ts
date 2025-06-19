import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        // 1. Obtener datos del cuerpo
        const body = await request.json();

        // 2. Validar campos mínimos (sin Zod para mantener compatibilidad)
        if (!body.email || !body.password) {
            return NextResponse.json(
                { ok: false, error: "Email y password son requeridos" },
                { status: 400 }
            );
        }

        // 3. Reenviar al backend Flask (formato exacto que espera tu compañero)
        const flaskResponse = await fetch('http://192.168.2.47:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // 4. Manejar respuesta del backend
        const result = await flaskResponse.json();
        console.log('resultado del login back', result)


        if (!flaskResponse.ok || !result.ok) {
            return NextResponse.json(
                { ok: false, error: result.error || result.message || "Error en autenticación" },
                { status: flaskResponse.status }
            );
        }

        // 5. Configurar cookie segura con el token recibido
        (await cookies()).set({
            name: 'authToken',
            value: result.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 8, // 8 horas (igual que la expiración del token)
            path: '/',
        });

        // 6. Retornar datos del usuario (formato compatible)
        return NextResponse.json({
            ok: true,
            message: result.message,
            user: {
                id: result.user?.id,
                name: result.user?.name,
                email: result.user?.email,
                role: result.user?.role || result.rol // Compatible con ambos formatos
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { ok: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}