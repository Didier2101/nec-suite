import DeviceDetails from "@/components/DeviceDetails";


export default async function DeviceDetailsPage({ params }: {
    params: Promise<{ ip: string }>
}) {
    const deviceIp = (await params).ip;
    console.log('params:', params); // Debugging log




    return (
        <DeviceDetails deviceIp={deviceIp} />
    );
}