import Image from 'next/image';
import React from 'react'
import Logo from './Logo';

type HeaderNecSuiteProps = {
    title: string;
    description?: string;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function HeaderNecSuite({ title, description, Icon }: HeaderNecSuiteProps) {
    return (
        <div className="flex bg-white p-6">
            <div className=" ">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    {Icon && <Icon className="mr-3 h-8 w-8 text-blue-600" />}
                    {title}
                </h1>
                <p className="text-gray-600 mt-1">{description}</p>
            </div>
            <Image
                src="/nec-logo-2.svg"
                alt="NEC Suite Logo"
                width={120}
                height={50}
                className="ml-auto h-12 w-auto"
                priority={true}
                loading="eager"
                unoptimized={true} // Evita problemas de optimización con Next.js
            />
        </div>
    )
}
