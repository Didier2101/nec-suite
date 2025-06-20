import React from 'react'

type HeaderNecSuiteProps = {
    title: string;
    description?: string;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function HeaderNecSuite({ title, description, Icon }: HeaderNecSuiteProps) {
    return (
        <div className="bg-white shadow">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            {Icon && <Icon className="mr-3 h-8 w-8 text-blue-600" />}
                            {title}
                        </h1>
                        <p className="text-gray-600 mt-1">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
