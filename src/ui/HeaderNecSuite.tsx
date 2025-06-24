import React from 'react'

type HeaderNecSuiteProps = {
    title: string;
    description?: string;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function HeaderNecSuite({ title, description, Icon }: HeaderNecSuiteProps) {
    return (
        <div className="bg-white p-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {Icon && <Icon className="mr-3 h-8 w-8 text-blue-600" />}
                {title}
            </h1>
            <p className="text-gray-600 mt-1">{description}</p>
        </div>
    )
}
