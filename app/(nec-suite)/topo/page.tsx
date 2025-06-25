import MainTopoLogic from "@/components/topo_logic/MainTopoLogic";
import Loading from "@/src/ui/Loading";
import { Suspense } from "react";


export default function Page() {
    return (
        <Suspense fallback={<Loading text="Cargando Topologia..." />}>
            <MainTopoLogic />;

        </Suspense>
    )
}
