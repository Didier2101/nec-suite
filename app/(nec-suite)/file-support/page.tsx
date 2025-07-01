import { Suspense } from "react";
import Loading from "@/src/ui/Loading";
import MainSupport from "@/components/file-support/MainSupport";


export default function FileSupportPage() {
    return (
        <Suspense fallback={<Loading />}>
            <MainSupport />
        </Suspense>

    );
}