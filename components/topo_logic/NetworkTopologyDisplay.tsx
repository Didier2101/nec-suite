"use client";

import Loading from '@/src/ui/Loading';
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ApiNode {
    id: number;
    label: string;
    type?: string;
    [key: string]: any;
}

interface ApiLink {
    source: number;
    target: number;
    [key: string]: any;
}

interface PositionedNode extends ApiNode {
    x: number;
    y: number;
    type: string;
    displayName: string;
    deviceType: string;
}

interface Connection {
    from: number;
    to: number;
    fromPos: { x: number; y: number };
    toPos: { x: number; y: number };
    fromLabel: string;
    toLabel: string;
}

const NetworkTopologyDisplay = () => {
    const [nodes, setNodes] = useState<ApiNode[]>([]);
    const [links, setLinks] = useState<ApiLink[]>([]);
    const [positionedNodes, setPositionedNodes] = useState<PositionedNode[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [draggedNode, setDraggedNode] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [selectedNode, setSelectedNode] = useState<PositionedNode | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    // Función para determinar el tipo de dispositivo basado en el label
    const determineDeviceType = (label: string): { type: string; displayName: string; deviceType: string } => {
        const lowerLabel = label.toLowerCase();

        if (lowerLabel.includes('router') || lowerLabel.includes('mx') || lowerLabel.includes('ptx')) {
            return {
                type: 'router',
                displayName: label.split(':')[0] || label,
                deviceType: 'Router'
            };
        } else if (lowerLabel.includes('switch') || lowerLabel.includes('ex') || lowerLabel.includes('leaf')) {
            return {
                type: 'switch',
                displayName: label.split(':')[0] || label,
                deviceType: 'Switch'
            };
        } else if (lowerLabel.includes('acx')) {
            return {
                type: 'access',
                displayName: label.split(':')[0] || label,
                deviceType: 'Access Switch'
            };
        } else if (lowerLabel.includes('host') || lowerLabel.includes('pc') || lowerLabel.includes('server')) {
            return {
                type: 'host',
                displayName: label.split(':')[0] || label,
                deviceType: 'Host'
            };
        } else {
            return {
                type: 'device',
                displayName: label.split(':')[0] || label,
                deviceType: 'Network Device'
            };
        }
    };

    const nodeStyles = {
        router: {
            color: '#DC2626',
            gradient: 'routerGradient',
            icon: '🔄',
            strokeColor: '#FCA5A5'
        },
        switch: {
            color: '#059669',
            gradient: 'switchGradient',
            icon: '🔀',
            strokeColor: '#6EE7B7'
        },
        access: {
            color: '#7C3AED',
            gradient: 'accessGradient',
            icon: '🔗',
            strokeColor: '#C4B5FD'
        },
        host: {
            color: '#D97706',
            gradient: 'hostGradient',
            icon: '💻',
            strokeColor: '#FCD34D'
        },
        device: {
            color: '#64748B',
            gradient: 'deviceGradient',
            icon: '📡',
            strokeColor: '#CBD5E1'
        }
    };

    // Algoritmo de layout mejorado con fuerzas
    const calculatePositions = (nodes: ApiNode[], links: ApiLink[]): PositionedNode[] => {
        const width = 1000;
        const height = 600;
        const centerX = width / 2;
        const centerY = height / 2;

        // Crear nodos posicionados con información mejorada
        const positioned = nodes.map((node, index) => {
            const deviceInfo = determineDeviceType(node.label);
            const angle = (index / nodes.length) * 2 * Math.PI;
            const radius = Math.min(width, height) * 0.3;

            return {
                ...node,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                ...deviceInfo
            };
        });

        // Simulación de fuerzas mejorada
        for (let iteration = 0; iteration < 15; iteration++) {
            positioned.forEach(node => {
                let fx = 0, fy = 0;

                // Fuerza de repulsión entre todos los nodos
                positioned.forEach(other => {
                    if (node.id !== other.id) {
                        const dx = node.x - other.x;
                        const dy = node.y - other.y;
                        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                        const repulsionForce = 2000 / (distance * distance);

                        fx += (dx / distance) * repulsionForce;
                        fy += (dy / distance) * repulsionForce;
                    }
                });

                // Fuerza de atracción para nodos conectados
                links.forEach(link => {
                    let connectedNodeId = null;
                    if (link.source === node.id) connectedNodeId = link.target;
                    if (link.target === node.id) connectedNodeId = link.source;

                    if (connectedNodeId !== null) {
                        const connectedNode = positioned.find(n => n.id === connectedNodeId);
                        if (connectedNode) {
                            const dx = connectedNode.x - node.x;
                            const dy = connectedNode.y - node.y;
                            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                            const attractionForce = distance * 0.01;

                            fx += (dx / distance) * attractionForce;
                            fy += (dy / distance) * attractionForce;
                        }
                    }
                });

                // Fuerza hacia el centro
                const centerDx = centerX - node.x;
                const centerDy = centerY - node.y;
                const centerDistance = Math.sqrt(centerDx * centerDx + centerDy * centerDy) || 1;
                const centerForce = centerDistance * 0.001;

                fx += (centerDx / centerDistance) * centerForce;
                fy += (centerDy / centerDistance) * centerForce;

                // Aplicar fuerzas con damping
                const damping = 0.85;
                node.x += fx * 0.1 * damping;
                node.y += fy * 0.1 * damping;

                // Mantener dentro de los límites
                const margin = 80;
                node.x = Math.max(margin, Math.min(node.x, width - margin));
                node.y = Math.max(margin, Math.min(node.y, height - margin));
            });
        }

        return positioned;
    };

    // Generar conexiones mejoradas
    const generateConnections = (nodes: PositionedNode[], links: ApiLink[]): Connection[] => {
        return links.map(link => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);

            if (!sourceNode || !targetNode) return null;

            return {
                from: sourceNode.id,
                to: targetNode.id,
                fromPos: { x: sourceNode.x, y: sourceNode.y },
                toPos: { x: targetNode.x, y: targetNode.y },
                fromLabel: sourceNode.displayName,
                toLabel: targetNode.displayName
            };
        }).filter(Boolean) as Connection[];
    };

    // Cargar datos de la API
    useEffect(() => {
        const fetchTopology = async () => {
            try {
                const response = await fetch('/api/topo');
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log('Datos de topología recibidos:', data);

                setNodes(data.nodes);
                setLinks(data.links);

                const positioned = calculatePositions(data.nodes, data.links);
                setPositionedNodes(positioned);

                const conns = generateConnections(positioned, data.links);
                setConnections(conns);

            } catch (err) {
                console.error("Error fetching topology:", err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchTopology();
    }, []);

    // Funciones de interacción
    const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggedNode(nodeId);

        const node = positionedNodes.find(n => n.id === nodeId);
        if (!node) return;

        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left) / zoomLevel - panOffset.x;
        const y = (e.clientY - rect.top) / zoomLevel - panOffset.y;

        setDragOffset({
            x: x - node.x,
            y: y - node.y
        });
    }, [positionedNodes, zoomLevel, panOffset]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!draggedNode) return;

        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left) / zoomLevel - panOffset.x - dragOffset.x;
        const y = (e.clientY - rect.top) / zoomLevel - panOffset.y - dragOffset.y;

        setPositionedNodes(prev => {
            const updated = prev.map(node =>
                node.id === draggedNode
                    ? { ...node, x: Math.max(50, Math.min(x, 950)), y: Math.max(50, Math.min(y, 550)) }
                    : node
            );

            const updatedConnections = generateConnections(updated, links);
            setConnections(updatedConnections);

            return updated;
        });
    }, [draggedNode, dragOffset, links, zoomLevel, panOffset]);

    const handleMouseUp = useCallback(() => {
        setDraggedNode(null);
        setDragOffset({ x: 0, y: 0 });
    }, []);

    const handleNodeClick = (node: PositionedNode) => {
        setSelectedNode(selectedNode?.id === node.id ? null : node);
    };

    const autoArrange = () => {
        if (nodes.length === 0 || links.length === 0) return;

        const positioned = calculatePositions(nodes, links);
        setPositionedNodes(positioned);
        const conns = generateConnections(positioned, links);
        setConnections(conns);
    };

    const handleZoom = (delta: number) => {
        setZoomLevel(prev => Math.max(0.5, Math.min(prev + delta, 2)));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <p>Cargando topología de red...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-red-200">
                    <div className="flex items-center mb-4">
                        <div className="text-red-500 text-3xl mr-4">⚠️</div>
                        <div>
                            <h3 className="text-xl font-bold text-red-800">Error de Conexión</h3>
                            <p className="text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (nodes.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📡</div>
                    <p className="text-xl text-gray-500">No hay datos de topología disponibles</p>
                </div>
            </div>
        );
    }

    const deviceStats = positionedNodes.reduce((acc, node) => {
        acc[node.type] = (acc[node.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header mejorado */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Topología de Red</h1>
                            <p className="text-gray-600">Visualización interactiva de la infraestructura de red</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleZoom(-0.1)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                title="Alejar"
                            >
                                🔍-
                            </button>
                            <button
                                onClick={() => handleZoom(0.1)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                title="Acercar"
                            >
                                🔍+
                            </button>
                            <button
                                onClick={autoArrange}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                            >
                                <span className="text-lg">🎯</span>
                                Auto-organizar
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                            >
                                <span className="text-lg">🔄</span>
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Diagrama principal */}
                    <div className="xl:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-700">Mapa de Red</h3>
                            <p className="text-sm text-gray-500">Zoom: {Math.round(zoomLevel * 100)}%</p>
                        </div>
                        <div className="relative" style={{ height: '700px' }}>
                            <svg
                                ref={svgRef}
                                width="100%"
                                height="100%"
                                viewBox={`${-panOffset.x} ${-panOffset.y} ${1000 / zoomLevel} ${600 / zoomLevel}`}
                                className="cursor-grab active:cursor-grabbing"
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {/* Definiciones de gradientes */}
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" opacity="0.5" />
                                    </pattern>
                                    <linearGradient id="routerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FCA5A5" />
                                        <stop offset="100%" stopColor="#DC2626" />
                                    </linearGradient>
                                    <linearGradient id="switchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#6EE7B7" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                    <linearGradient id="accessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#C4B5FD" />
                                        <stop offset="100%" stopColor="#7C3AED" />
                                    </linearGradient>
                                    <linearGradient id="hostGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FCD34D" />
                                        <stop offset="100%" stopColor="#D97706" />
                                    </linearGradient>
                                    <linearGradient id="deviceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#CBD5E1" />
                                        <stop offset="100%" stopColor="#64748B" />
                                    </linearGradient>
                                </defs>

                                <rect width="1000" height="600" fill="url(#grid)" />

                                {/* Conexiones mejoradas */}
                                {connections.map((conn, index) => {
                                    const dx = conn.toPos.x - conn.fromPos.x;
                                    const dy = conn.toPos.y - conn.fromPos.y;
                                    const length = Math.sqrt(dx * dx + dy * dy);
                                    const unitX = dx / length;
                                    const unitY = dy / length;
                                    const offset = 40;

                                    const startX = conn.fromPos.x + unitX * offset;
                                    const startY = conn.fromPos.y + unitY * offset;
                                    const endX = conn.toPos.x - unitX * offset;
                                    const endY = conn.toPos.y - unitY * offset;

                                    return (
                                        <g key={index}>
                                            <line
                                                x1={startX}
                                                y1={startY}
                                                x2={endX}
                                                y2={endY}
                                                stroke="#64748b"
                                                strokeWidth="3"
                                                strokeDasharray="5,5"
                                                className="drop-shadow-sm"
                                                opacity="0.7"
                                            />
                                        </g>
                                    );
                                })}

                                {/* Nodos mejorados */}
                                {positionedNodes.map((node) => {
                                    const style = nodeStyles[node.type as keyof typeof nodeStyles];
                                    const isSelected = selectedNode?.id === node.id;

                                    return (
                                        <g
                                            key={node.id}
                                            transform={`translate(${node.x}, ${node.y})`}
                                            className="cursor-pointer hover:opacity-90 transition-all duration-200"
                                            onMouseDown={(e) => handleMouseDown(e, node.id)}
                                            onClick={() => handleNodeClick(node)}
                                        >
                                            {/* Sombra del nodo */}
                                            <circle
                                                cx="3"
                                                cy="3"
                                                r={isSelected ? "45" : "38"}
                                                fill="rgba(0,0,0,0.15)"
                                                className="blur-sm"
                                            />

                                            {/* Círculo principal */}
                                            <circle
                                                r={isSelected ? "42" : "35"}
                                                fill={`url(#${style.gradient})`}
                                                stroke={isSelected ? "#2563EB" : "white"}
                                                strokeWidth={isSelected ? "4" : "3"}
                                                className="drop-shadow-lg transition-all duration-200"
                                            />

                                            {/* Icono del dispositivo */}
                                            <text
                                                textAnchor="middle"
                                                dy="8"
                                                className="fill-white text-2xl font-bold pointer-events-none select-none drop-shadow-sm"
                                            >
                                                {style.icon}
                                            </text>

                                            {/* Nombre del dispositivo */}
                                            <text
                                                textAnchor="middle"
                                                dy={isSelected ? "65" : "58"}
                                                className="fill-gray-700 text-sm font-bold pointer-events-none select-none"
                                                style={{ fontSize: isSelected ? '14px' : '12px' }}
                                            >
                                                {node.displayName.length > 20 ?
                                                    node.displayName.substring(0, 17) + '...' :
                                                    node.displayName}
                                            </text>

                                            {/* Tipo del dispositivo */}
                                            <text
                                                textAnchor="middle"
                                                dy={isSelected ? "80" : "73"}
                                                className="fill-gray-500 text-xs font-medium pointer-events-none select-none"
                                            >
                                                {node.deviceType}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Panel lateral */}
                    <div className="space-y-6">
                        {/* Información del nodo seleccionado */}
                        {selectedNode && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                                    <span className="text-2xl">{nodeStyles[selectedNode.type as keyof typeof nodeStyles].icon}</span>
                                    Detalles del Dispositivo
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nombre</label>
                                        <p className="text-gray-800 font-semibold">{selectedNode.displayName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Tipo</label>
                                        <p className="text-gray-800">{selectedNode.deviceType}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Label Completo</label>
                                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded break-all">
                                            {selectedNode.label}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">ID</label>
                                        <p className="text-gray-800">{selectedNode.id}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Estadísticas */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Estadísticas de Red</h3>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{nodes.length}</div>
                                    <div className="text-xs text-gray-600">Dispositivos</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{links.length}</div>
                                    <div className="text-xs text-gray-600">Conexiones</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {Object.entries(deviceStats).map(([type, count]) => {
                                    const style = nodeStyles[type as keyof typeof nodeStyles];
                                    return (
                                        <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center gap-2">
                                                <span>{style.icon}</span>
                                                <span className="text-sm font-medium capitalize">{type}</span>
                                            </div>
                                            <span className="text-sm font-bold" style={{ color: style.color }}>
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Lista de dispositivos */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Dispositivos de Red</h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                {positionedNodes.map((node) => {
                                    const style = nodeStyles[node.type as keyof typeof nodeStyles];
                                    const isSelected = selectedNode?.id === node.id;

                                    return (
                                        <div
                                            key={node.id}
                                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                                                }`}
                                            onClick={() => handleNodeClick(node)}
                                        >
                                            <span className="text-xl mr-3">{style.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-800 text-sm truncate">
                                                    {node.displayName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {node.deviceType}
                                                </div>
                                            </div>
                                            <div
                                                className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                                                style={{ backgroundColor: style.color }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetworkTopologyDisplay;