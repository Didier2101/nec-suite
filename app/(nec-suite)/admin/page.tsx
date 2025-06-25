import MainAdmin from "@/components/admin/MainAdmin";
import Loading from "@/src/ui/Loading";
import { Suspense } from "react";

export default function AdminPage() {


    return (
        <Suspense fallback={<Loading />}>
            <MainAdmin />
        </Suspense>
    );
}