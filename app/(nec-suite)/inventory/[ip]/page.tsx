// app/(nec-suite)/inventory/[ip]/page.tsx
import DeviceDetails from "@/components/device/DeviceDetails";

export default async function DeviceDetailsPage({ params }: {
    params: { ip: string }
}) {
    // Add 'await' here, even if 'params' is typed as a simple object.
    // Next.js is requiring it to ensure full resolution.
    const { ip } = await params;
    const deviceIp = ip;

    return (
        <DeviceDetails deviceIp={deviceIp} />
    );
}