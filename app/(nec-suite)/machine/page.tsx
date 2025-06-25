'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
    Activity,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Server,
    Shield
} from 'lucide-react'
import { Chart, registerables } from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

// Registrar componentes necesarios
Chart.register(...registerables)

interface LogEntry {
    id: number
    error: number
    is_anomaly: boolean
    log: string
}

export default function MachineLearningDashboard() {
    // Estado
    const [data, setData] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdate, setLastUpdate] = useState<string | null>(null)

    // Referencias para los gráficos
    const barChartRef = useRef<Chart<'bar'>>(null)
    const pieChartRef = useRef<Chart<'pie'>>(null)

    // Fetch de datos optimizado
    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/machine')
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const result = await response.json()
            setData(Array.isArray(result) ? result.slice(0, 500) : [])
            setLastUpdate(new Date().toLocaleTimeString())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Procesamiento de datos optimizado
    type DeviceDataType = {
        labels: string[]
        datasets: {
            label: string
            data: number[]
            backgroundColor: string
            borderWidth: number
        }[]
    }
    type SeverityDataType = {
        labels: string[]
        datasets: {
            data: number[]
            backgroundColor: string[]
            borderWidth: number
        }[]
    }
    const { deviceData, severityData } = useMemo<{
        deviceData: DeviceDataType
        severityData: SeverityDataType
    }>(() => {
        const defaultReturn = {
            deviceData: { labels: [], datasets: [] },
            severityData: { labels: [], datasets: [] }
        }
        if (!data.length) return defaultReturn

        const deviceCounts: Record<string, { good: number, bad: number }> = {}

        data.forEach(entry => {
            const deviceMatch = entry.log.match(/^\<\d+\>\w+\s+\d+\s+\d+:\d+:\d+\s+([^\s]+)/)
            const device = deviceMatch?.[1] || 'Desconocido'
            if (!deviceCounts[device]) {
                deviceCounts[device] = { good: 0, bad: 0 }
            }
            if (entry.is_anomaly) {
                deviceCounts[device].bad++
            } else {
                deviceCounts[device].good++
            }
        })

        const devices = Object.keys(deviceCounts)
        const goodCounts = devices.map(device => deviceCounts[device].good)
        const badCounts = devices.map(device => deviceCounts[device].bad)

        const totalGood = data.filter(item => !item.is_anomaly).length
        const totalBad = data.filter(item => item.is_anomaly).length

        return {
            deviceData: {
                labels: devices,
                datasets: [
                    {
                        label: 'Normales',
                        data: goodCounts,
                        backgroundColor: '#10B981',
                        borderWidth: 0
                    },
                    {
                        label: 'Anomalías',
                        data: badCounts,
                        backgroundColor: '#EF4444',
                        borderWidth: 0
                    }
                ]
            },
            severityData: {
                labels: ['Normales', 'Anomalías'],
                datasets: [{
                    data: [totalGood, totalBad],
                    backgroundColor: ['#10B981', '#EF4444'],
                    borderWidth: 0
                }]
            }
        }
    }, [data])

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
            legend: { position: 'top' as const },
            tooltip: { enabled: true, intersect: false }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">Cargando datos de análisis...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Análisis de Logs - Machine Learning
                            </h1>
                            <p className="text-gray-600">
                                Detección de anomalías en logs de dispositivos de red
                            </p>
                        </div>
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                    </div>
                    {lastUpdate && (
                        <p className="text-sm text-gray-500 mt-2">
                            Última actualización: {lastUpdate}
                        </p>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h3 className="font-semibold text-red-800">Error al cargar datos</h3>
                        </div>
                        <p className="text-red-700 mt-1">{error}</p>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Total */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3">
                            <Activity className="w-8 h-8 text-blue-600" />
                            <div>
                                <h3 className="font-semibold text-gray-800">Total Logs</h3>
                                <p className="text-2xl font-bold text-blue-600">{data.length}</p>
                            </div>
                        </div>
                    </div>
                    {/* Normales */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div>
                                <h3 className="font-semibold text-gray-800">Normales</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {severityData.datasets?.[0]?.data?.[0] || 0}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {data.length > 0 ?
                                        ((severityData.datasets[0].data[0] / data.length) * 100).toFixed(1) + '%' :
                                        '0%'}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Anomalías */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                            <div>
                                <h3 className="font-semibold text-gray-800">Anomalías</h3>
                                <p className="text-2xl font-bold text-red-600">
                                    {severityData.datasets?.[0]?.data?.[1] || 0}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {data.length > 0 ?
                                        ((severityData.datasets[0].data[1] / data.length) * 100).toFixed(1) + '%' :
                                        '0%'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Bar Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            <Server className="inline w-5 h-5 mr-2" />
                            Logs por Dispositivo (Top 15)
                        </h2>
                        <div className="h-[300px]">
                            <Bar
                                ref={barChartRef}
                                data={{
                                    labels: deviceData.labels?.slice(0, 15),
                                    datasets: deviceData.datasets?.map(ds => ({
                                        ...ds,
                                        data: ds.data.slice(0, 15)
                                    }))
                                }}
                                options={{
                                    ...chartOptions,
                                    scales: {
                                        x: { stacked: true },
                                        y: { stacked: true }
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* Pie Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            <Shield className="inline w-5 h-5 mr-2" />
                            Distribución de Logs
                        </h2>
                        <div className="h-[300px]">
                            <Pie
                                ref={pieChartRef}
                                data={severityData}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Logs Recientes (Últimos 10)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">ID</th>
                                    <th className="text-left py-2">Dispositivo</th>
                                    <th className="text-left py-2">Estado</th>
                                    <th className="text-left py-2">Error</th>
                                    <th className="text-left py-2">Mensaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 10).map((entry) => {
                                    const deviceMatch = entry.log.match(/^\<\d+\>\w+\s+\d+\s+\d+:\d+:\d+\s+([^\s]+)/)
                                    const device = deviceMatch?.[1] || 'Desconocido'
                                    const shortLog = entry.log.length > 50
                                        ? `${entry.log.substring(0, 50)}...`
                                        : entry.log

                                    return (
                                        <tr key={entry.id} className="border-b hover:bg-gray-50">
                                            <td className="py-2">{entry.id}</td>
                                            <td className="py-2 font-mono text-xs">{device}</td>
                                            <td className={`py-2 font-semibold ${entry.is_anomaly ? 'text-red-600' : 'text-green-600'}`}>
                                                {entry.is_anomaly ? 'Anomalía' : 'Normal'}
                                            </td>
                                            <td className="py-2">{entry.error.toFixed(2)}</td>
                                            <td className="py-2 max-w-md truncate" title={entry.log}>
                                                {shortLog}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
