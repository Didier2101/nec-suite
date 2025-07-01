import Logo from "@/src/ui/Logo";
import { LogOut } from "lucide-react";


export default function Header() {
    return (
        <div className="bg-white py-3 px-4 md:px-6 relative z-10">
            <div className="">
                {/* Desktop Header */}

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {/* Botón para abrir/cerrar sidebar */}

                        <Logo width={250} height={160} />
                    </div>

                    <div className="text-right flex items-center gap-10">
                        <div className=" hidden md:flex flex-col items-end">
                            <h1 className="text-xl font-bold text-blue-800">
                                NEC suite
                            </h1>
                            <div className="flex justify-end gap-1.5">
                                <p className="text-xs text-gray-600">Powered by</p>
                                <span className="text-xs text-gray-500">Llama 3.0</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>

    )
}
