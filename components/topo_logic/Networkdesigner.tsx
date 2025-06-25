import React, { useRef, useState, useEffect, useCallback } from "react";
import { Network, Router, Monitor, Shield, HardDrive, Download, Link as LinkIcon, Move, Trash2, Plus, Server } from "lucide-react";

type NodeType = 'router' | 'switch' | 'computer' | 'firewall' | 'server';

interface Node {
    id: string;
    type: NodeType;
    name: string;
    x: number;
    y: number;
    interfaces: string[];
}

interface Connection {
    source: string;
    target: string;
    sourceInterface: string;
    targetInterface: string;
}

const DEFAULT_NODES: Node[] = [
    {
        "id": "R1",
        "type": "router",
        "name": "Router Principal",
        "x": 200,
        "y": 100,
        "interfaces": ["eth0", "eth1", "serial0"]
    },
    {
        "id": "R2",
        "type": "router",
        "name": "Router Secundario",
        "x": 500,
        "y": 100,
        "interfaces": ["eth0", "eth1", "eth2", "serial0"]
    },
    {
        "id": "SW1",
        "type": "switch",
        "name": "Switch Core",
        "x": 350,
        "y": 250,
        "interfaces": ["port1", "port2", "port3", "port4", "port5"]
    },
    {
        "id": "PC1",
        "type": "computer",
        "name": "Workstation 1",
        "x": 150,
        "y": 350,
        "interfaces": ["eth0"]
    },
    {
        "id": "PC2",
        "type": "computer",
        "name": "Workstation 2",
        "x": 300,
        "y": 400,
        "interfaces": ["eth0"]
    },
    {
        "id": "SRV1",
        "type": "server",
        "name": "Server",
        "x": 550,
        "y": 350,
        "interfaces": ["eth0", "eth1"]
    },
    {
        "id": "FW1",
        "type": "firewall",
        "name": "Firewall Principal",
        "x": 350,
        "y": 50,
        "interfaces": ["wan", "lan", "dmz"]
    }
];

const DEFAULT_CONNECTIONS: Connection[] = [
    {
        source: "R1",
        target: "SW1",
        sourceInterface: "eth0",
        targetInterface: "port1"
    },
    {
        source: "R2",
        target: "SW1",
        sourceInterface: "eth0",
        targetInterface: "port2"
    },
    {
        source: "FW1",
        target: "R1",
        sourceInterface: "lan",
        targetInterface: "eth1"
    }
];

const NODE_ICONS = {
    router: Router,
    switch: Network,
    computer: Monitor,
    firewall: Shield,
    server: Server
};

const NODE_COLORS = {
    router: "#3b82f6",
    switch: "#10b981",
    computer: "#8b5cf6",
    firewall: "#ef4444",
    server: "#f97316"
};

const NetworkDesigner = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [nodes, setNodes] = useState<Node[]>(DEFAULT_NODES);
    const [connections, setConnections] = useState<Connection[]>(DEFAULT_CONNECTIONS);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [connectionStart, setConnectionStart] = useState<Node | null>(null);
    const [mode, setMode] = useState<"select" | "connect">("select");
    const [showInterfaceDialog, setShowInterfaceDialog] = useState(false);
    const [currentConnection, setCurrentConnection] = useState<{ source: Node, target: Node } | null>(null);

    // Manejador para comenzar arrastre de nodo
    const handleDragStart = useCallback((node: Node, e: React.MouseEvent) => {
        if (mode !== "select") return;

        const startX = e.clientX;
        const startY = e.clientY;
        const originalX = node.x;
        const originalY = node.y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            setNodes(prevNodes => prevNodes.map(n =>
                n.id === node.id
                    ? { ...n, x: originalX + dx, y: originalY + dy }
                    : n
            ));
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        e.preventDefault();
    }, [mode]);

    // Manejador para hacer clic en nodo
    const handleNodeClick = useCallback((node: Node, e: React.MouseEvent) => {
        e.stopPropagation();

        if (mode === "connect") {
            if (!connectionStart) {
                setConnectionStart(node);
            } else if (connectionStart.id !== node.id) {
                setCurrentConnection({ source: connectionStart, target: node });
                setShowInterfaceDialog(true);
                setConnectionStart(null);
            }
        } else {
            setSelectedNode(node);
        }
    }, [mode, connectionStart]);

    // Crear nueva conexión
    const createConnection = useCallback((sourceInterface: string, targetInterface: string) => {
        if (!currentConnection) return;

        const newConnection: Connection = {
            source: currentConnection.source.id,
            target: currentConnection.target.id,
            sourceInterface,
            targetInterface
        };

        setConnections(prev => [...prev, newConnection]);
        setShowInterfaceDialog(false);
        setCurrentConnection(null);
    }, [currentConnection]);

    // Eliminar nodo seleccionado
    const deleteSelectedNode = useCallback(() => {
        if (!selectedNode) return;

        setNodes(prev => prev.filter(n => n.id !== selectedNode.id));
        setConnections(prev => prev.filter(c =>
            c.source !== selectedNode.id && c.target !== selectedNode.id
        ));
        setSelectedNode(null);
    }, [selectedNode]);

    // Renderizar nodos
    const renderNodes = useCallback(() => {
        return nodes.map(node => {
            const Icon = NODE_ICONS[node.type];
            const isSelected = selectedNode?.id === node.id;
            const isConnectionSource = connectionStart?.id === node.id;

            return (
                <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onMouseDown={(e) => handleDragStart(node, e)}
                    onClick={(e) => handleNodeClick(node, e)}
                    className="cursor-move"
                >
                    {/* Círculo de fondo */}
                    <circle
                        r={30}
                        fill={NODE_COLORS[node.type]}
                        stroke={isSelected ? "#f59e0b" : isConnectionSource ? "#84cc16" : "#ffffff"}
                        strokeWidth={isSelected || isConnectionSource ? 3 : 2}
                        className="transition-all duration-200"
                    />

                    {/* Icono */}
                    <foreignObject x={-15} y={-15} width={30} height={30}>
                        <div className="flex items-center justify-center h-full">
                            <Icon className="text-white" size={20} />
                        </div>
                    </foreignObject>

                    {/* Etiqueta */}
                    <text
                        x={0}
                        y={45}
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight={600}
                        fill="#1f2937"
                    >
                        {node.id}
                    </text>

                    {/* Tooltip */}
                    <title>{node.name} ({node.type})</title>
                </g>
            );
        });
    }, [nodes, selectedNode, connectionStart, handleDragStart, handleNodeClick]);

    // Renderizar conexiones
    const renderConnections = useCallback(() => {
        return connections.map((conn, index) => {
            const sourceNode = nodes.find(n => n.id === conn.source);
            const targetNode = nodes.find(n => n.id === conn.target);

            if (!sourceNode || !targetNode) return null;

            return (
                <g key={`${conn.source}-${conn.target}-${index}`}>
                    {/* Línea de conexión */}
                    <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke="#94a3b8"
                        strokeWidth={3}
                        strokeLinecap="round"
                    />

                    {/* Etiqueta de conexión */}
                    <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#64748b"
                        dy={-5}
                    >
                        {conn.sourceInterface} ↔ {conn.targetInterface}
                    </text>
                </g>
            );
        });
    }, [connections, nodes]);

    return (
        <div className="h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Network className="text-blue-600" size={32} />
                        Diseñador de Topología de Red
                    </h1>
                    <p className="text-gray-600">
                        {mode === "connect" && connectionStart
                            ? `Modo conexión: Seleccione el nodo destino para conectar con ${connectionStart.id}`
                            : "Crea y edita topologías de red de forma interactiva"}
                    </p>
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMode("select")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${mode === "select"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <Move size={18} />
                                Seleccionar
                            </button>
                            <button
                                onClick={() => {
                                    setMode("connect");
                                    setConnectionStart(null);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${mode === "connect"
                                        ? "bg-green-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <LinkIcon size={18} />
                                Conectar
                            </button>
                        </div>

                        <div className="h-6 w-px bg-gray-300"></div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const data = JSON.stringify({ nodes, connections }, null, 2);
                                    navigator.clipboard.writeText(data);
                                    alert("Topología copiada al portapapeles");
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                            >
                                <Download size={18} />
                                Exportar
                            </button>
                            {selectedNode && (
                                <button
                                    onClick={deleteSelectedNode}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                                >
                                    <Trash2 size={18} />
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative">
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="100%"
                        className="cursor-default"
                        onClick={() => {
                            setSelectedNode(null);
                            if (mode === "connect") setConnectionStart(null);
                        }}
                    >
                        {renderConnections()}
                        {renderNodes()}
                    </svg>
                </div>

                {/* Panel de información */}
                {selectedNode && (
                    <div className="mt-4 bg-white rounded-lg shadow p-4 border border-gray-200">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            {React.createElement(NODE_ICONS[selectedNode.type], { size: 20 })}
                            {selectedNode.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="font-medium text-gray-600">ID:</span> {selectedNode.id}</div>
                            <div><span className="font-medium text-gray-600">Tipo:</span> {selectedNode.type}</div>
                            <div><span className="font-medium text-gray-600">Posición:</span> ({selectedNode.x}, {selectedNode.y})</div>
                            <div><span className="font-medium text-gray-600">Interfaces:</span> {selectedNode.interfaces.join(", ")}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Diálogo de selección de interfaces */}
            {showInterfaceDialog && currentConnection && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Configurar Conexión</h3>
                        <p className="text-gray-600 mb-6">
                            {currentConnection.source.id} ↔ {currentConnection.target.id}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {currentConnection.source.id} - Interface:
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded"
                                    defaultValue={currentConnection.source.interfaces[0]}
                                >
                                    {currentConnection.source.interfaces.map(iface => (
                                        <option key={iface} value={iface}>{iface}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {currentConnection.target.id} - Interface:
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded"
                                    defaultValue={currentConnection.target.interfaces[0]}
                                >
                                    {currentConnection.target.interfaces.map(iface => (
                                        <option key={iface} value={iface}>{iface}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    const sourceSelect = document.querySelector(`#${currentConnection.source.id}-interface`) as HTMLSelectElement;
                                    const targetSelect = document.querySelector(`#${currentConnection.target.id}-interface`) as HTMLSelectElement;
                                    createConnection(
                                        sourceSelect?.value || currentConnection.source.interfaces[0],
                                        targetSelect?.value || currentConnection.target.interfaces[0]
                                    );
                                }}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
                            >
                                Conectar
                            </button>
                            <button
                                onClick={() => setShowInterfaceDialog(false)}
                                className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NetworkDesigner;