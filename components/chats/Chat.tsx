// components/chats/Vnoc.tsx
'use client';

import { formatTime } from "@/src/utils/formatTime";
import { MessageCircle, Send, User, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import TypewriterMessage from "./TypewriterMessage";
import { useUsername } from "@/types/useUsername";

type Message = {
    id: number;
    sender: 'user' | 'bot' | 'system';
    text: string;
    time: string;
    isError?: boolean;
};

type ChatType = 'vnoc' | 'rac';

type Props = {
    chatType: ChatType;
};

const CHAT_CONFIG = {
    vnoc: {
        title: 'Virtual NOC',
        description: 'Monitoring and operations chat',
        apiEndpoint: '/api/chat/vnoc', // this should be used
        welcomeMessage: 'Hi, I am Virtual NOC. How can I help you today?',
    },
    rac: {
        title: 'RAG Assistant',
        description: 'Technical assistance chat',
        apiEndpoint: '/api/chat/rac', // and this one for rac
        welcomeMessage: 'Hi, I am RAG Assistant. How can I assist you?',
    }
};


export default function Chat({ chatType }: Props) {
    const config = CHAT_CONFIG[chatType];
    const [messages, setMessages] = useState<Message[]>([]);

    // Hook para obtener el username desde cookies
    const username = useUsername();
    const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

    useEffect(() => {
        setMessages([
            {
                id: 1,
                sender: 'bot',
                text: config.welcomeMessage,
                time: new Date().toISOString(),
            }
        ]);
    }, [chatType, config.welcomeMessage]);

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const addSystemMessage = (text: string, isError = false) => {
        const systemMessage: Message = {
            id: messages.length + 1,
            sender: 'system',
            text,
            time: new Date().toISOString(),
            isError
        };
        setMessages(prev => [...prev, systemMessage]);
    };

    // 🔥 FUNCIÓN HELPER PARA EXTRAER RESPUESTA
    const getResponseMessage = (status?: string, answer?: string) => {
        if (status === 'error') {
            return 'Sorry, there was an error processing your request.';
        }
        return answer || 'No response received from the server.';
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '' || isLoading) return;

        // Agregar mensaje del usuario
        const userMessage: Message = {
            id: generateId(),
            sender: 'user',
            text: inputValue,
            time: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsLoading(true);

        // Agregar mensaje de "Escribiendo..."
        const typingMessage: Message = {
            id: generateId(),
            sender: 'bot',
            text: '...',
            time: new Date().toISOString(),
        };
        setMessages(prev => [...prev, typingMessage]);

        // Timeout de 30 segundos
        const timeoutId = setTimeout(() => {
            addSystemMessage('The server is taking too long to respond. Please try again.', true);
            setIsLoading(false);
        }, 120000);


        try {

            // 🔥 PREPARAR PAYLOAD SEGÚN EL TIPO DE CHAT
            const bodyPayload = chatType === 'rac'
                ? {
                    username: username || "Anonymous",
                    query: currentInput
                }
                : {
                    message: currentInput
                };

            const response = await fetch(config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyPayload),
            });


            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Normalizar respuesta (puede ser array o objeto)
            const normalizedData = Array.isArray(data) ? data[0] : data;

            // Determinar el texto de respuesta según el tipo de chat y estructura de datos
            let responseText = '';

            if (chatType === 'rac') {
                // Para RAC, usar la lógica del sistema anterior
                responseText = getResponseMessage(normalizedData.status, normalizedData.answer);
            } else {
                // Para VNOC, usar la estructura anterior
                // Para VNOC: usar answer, message, o fallback
                responseText = normalizedData.answer ||
                    normalizedData.message ||
                    'No se recibió respuesta del servidor.';
            }

            // Reemplazar el mensaje "Escribiendo..." con la respuesta real
            setMessages(prev => [
                ...prev.slice(0, -1),
                {
                    id: messages.length + 2,
                    sender: 'bot',
                    text: responseText,
                    time: new Date().toISOString(),
                }
            ]);

        } catch (error) {
            clearTimeout(timeoutId);

            // Reemplazar el mensaje "Escribiendo..." con el error
            setMessages(prev => [
                ...prev.slice(0, -1),
                {
                    id: messages.length + 2,
                    sender: 'bot',
                    text: error instanceof Error ? error.message : 'Unknown error occurred while processing the request'
                    ,
                    time: new Date().toISOString(),
                    isError: true
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Scroll automático al final
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSendMessage();
        }
    };

    const resetChat = () => {
        setMessages([{
            id: 1,
            sender: 'bot',
            text: config.welcomeMessage,
            time: new Date().toISOString(),
        }]);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen overflow-auto">
            {/* Header de la página */}
            <div className="p-4">

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    onClick={resetChat}
                >
                    New Chat
                </button>
            </div>

            {/* Contenedor principal */}
            <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
                <div className="bg-white rounded-lg shadow flex flex-col flex-1 overflow-hidden">
                    {/* Historial del chat */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : message.isError
                                            ? 'bg-red-100 text-red-800 rounded-bl-none'
                                            : message.text === '...'
                                                ? 'bg-gray-50 text-gray-500 rounded-bl-none'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    <div className="flex items-center mb-1">
                                        {message.sender === 'user' ? (
                                            <User className="h-4 w-4 mr-2" />
                                        ) : (
                                            <Bot className="h-4 w-4 mr-2" />
                                        )}
                                        <span className="text-xs font-medium">
                                            {message.sender === 'user'
                                                ? (username || 'Tú')
                                                : config.title
                                            }
                                        </span>
                                        <span className="text-xs ml-2 opacity-70">
                                            {formatTime(message.time)}
                                        </span>
                                    </div>

                                    {/* mensaje */}
                                    {message.text === '...' ? (
                                        <span className="flex space-x-1">
                                            <span className="animate-bounce">.</span>
                                            <span className="animate-bounce delay-75">.</span>
                                            <span className="animate-bounce delay-150">.</span>
                                        </span>
                                    ) : message.sender === 'bot' && !message.isError ? (
                                        <TypewriterMessage text={message.text || ''} />
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Área de entrada de texto */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."

                                className={`w-full pl-4 pr-12 py-3 border ${isLoading ? 'border-gray-200' : 'border-gray-300'
                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
                                disabled={isLoading}
                            />
                            <button
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isLoading
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600 hover:text-blue-800'
                                    }`}
                                onClick={handleSendMessage}
                                disabled={isLoading}
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Press Enter to send.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}