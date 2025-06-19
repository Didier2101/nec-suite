'use client'
import { useEffect, useState } from "react";

type Props = {
    text: string;
    onDone?: () => void; // para notificar que terminó de escribir
};

export default function TypewriterMessage({ text, onDone }: Props) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        // Reiniciar el texto mostrado cuando cambia el texto
        setDisplayedText('');
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(interval);
                if (onDone) onDone();
            }
        }, 30); // Velocidad de tipeo (milisegundos por carácter)

        return () => clearInterval(interval);
    }, [text, onDone]);

    return <p className="text-sm whitespace-pre-wrap">{displayedText}</p>;
}