import { Suspense } from "react";
import { MainInventory } from "./MainInventory";
import Loading from "@/src/ui/Loading";


export default function MainInventoryPage() {

    return (
        <Suspense fallback={<Loading />}>
            <MainInventory />
        </Suspense>
    );
}