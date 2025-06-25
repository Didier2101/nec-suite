"use client";
import { topoLogicTabs } from "@/src/constants/tabs";
import Loading from "@/src/ui/Loading";
import { TabsNavigation } from "@/src/ui/TabsNavigation";
import { useState } from "react";
import NetworkTopologyDisplay from "./NetworkTopologyDisplay";
import NetworkDesigner from "./Networkdesigner";

export default function MainTopoLogic() {
    const [activeTab, setActiveTab] = useState<'topologia' | 'disenador'>('topologia');
    const [loading, setLoading] = useState(false);
    return (
        <div>
            <TabsNavigation
                tabs={topoLogicTabs}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as 'topologia' | 'disenador')}
                // onRefresh={fetchDeviceData} // ✅ Botón recargar
                loading={loading}
            />
            {/* Contenido */}
            <div className="max-w-7xl mx-auto">
                {loading && <Loading text="Cargando topologia de red..." />}
                {!loading && activeTab === 'topologia' && <NetworkTopologyDisplay />}
                {!loading && activeTab === 'disenador' && (
                    <NetworkDesigner />
                )}
            </div>
        </div>
    )
}
