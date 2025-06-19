
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { endpoint, ...payload } = body;

        if (!endpoint) {
            return NextResponse.json(
                { error: "Falta el campo 'endpoint'" },
                { status: 400 }
            );
        }

        // 📍 Tabla de rutas hacia Flask o proxies
        const flaskUrls: Record<string, string> = {
            rac: 'http://192.168.2.47:5002/api/rag_query',
            vnoc: 'http://192.168.2.47:5001/api/ask',
            login: 'http://192.168.2.47:5000/api/login',
            register: 'http://192.168.2.47:5000/api/register',
            logout: 'http://192.168.2.47:5000/api/logout',
            users_list: 'http://192.168.2.47:5000/api/users_list',
        };

        const flaskUrl = flaskUrls[endpoint];

        if (!flaskUrl) {
            console.warn(`⚠️ Endpoint '${endpoint}' no está implementado.`);
            console.log('📦 Payload recibido:', payload);
            return NextResponse.json({
                warning: `El endpoint '${endpoint}' aún no está implementado.`,
                received: payload,
            }, { status: 200 });
        }

        console.log(`📡 Reenviando a ${flaskUrl}`);
        console.log('📝 Payload:', JSON.stringify(payload, null, 2));

        const flaskRes = await fetch(flaskUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!flaskRes.ok) {
            const errText = await flaskRes.text();
            console.error(`❌ Error del servidor Flask (${flaskRes.status}): ${errText}`);
            throw new Error(`Flask error ${flaskRes.status}: ${errText}`);
        }

        const data = await flaskRes.json();

        // 🔐 MANEJO ESPECIAL PARA LOGIN: Configurar cookie si es exitoso
        if (endpoint === 'login' && data.ok && data.token) {
            (await cookies()).set({
                name: 'authToken',
                value: data.token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 8, // 8 horas
                path: '/',
            });

            console.log('🍪 Cookie de autenticación configurada exitosamente');
        }

        // 🚪 MANEJO ESPECIAL PARA LOGOUT: Limpiar cookie
        if (endpoint === 'logout') {
            (await cookies()).delete('authToken');
            console.log('🗑️ Cookie de autenticación eliminada');
        }

        return NextResponse.json(data);

    } catch (e) {
        console.error('❌ Error en /api/forward:', e);
        return NextResponse.json({
            error: e instanceof Error ? e.message : 'Error desconocido',
        }, { status: 500 });
    }
}