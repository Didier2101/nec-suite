import DeviceDetails from "@/components/device/DeviceDetails";


export default async function DeviceDetailsPage({ params }: {
    params: Promise<{ ip: string }>
}) {
    const deviceIp = (await params).ip;

    return (
        <DeviceDetails deviceIp={deviceIp} />
    );
}