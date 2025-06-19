import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar el username del usuario
 * Obtiene el nombre de usuario desde las cookies del navegador
 */
export const useUsername = () => {
    const [username, setUserName] = useState("");

    /**
     * Efecto que se ejecuta al montar el componente
     * Obtiene el nombre de usuario desde las cookies del navegador
     */
    useEffect(() => {
        // Función auxiliar para leer cookies
        const getCookie = (username: string) => {
            const cookies = document.cookie.split("; ");
            const cookie = cookies.find((c) => c.startsWith(`${username}=`));
            return cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined;
        };

        const username = getCookie("username");
        setUserName(username || "Invitado");
    }, []);

    return username;
};