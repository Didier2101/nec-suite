import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface Tab {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
}

interface TabsNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
    onRefresh?: () => void;
    loading?: boolean;
}

export const TabsNavigation = ({ tabs, activeTab, onTabChange, onRefresh, loading }: TabsNavigationProps) => {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="-mb-px flex space-x-8 items-center justify-between">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                                >
                                    <Icon className="h-5 w-5 mr-2" />
                                    {tab.name}
                                </button>
                            );
                        })}
                        {onRefresh && (
                            <button
                                onClick={onRefresh}
                                disabled={loading}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
            ${loading
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-red-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <RefreshCcw
                                    className={`h-5 w-5 mr-2 transition-transform duration-300 ${loading ? 'animate-spin' : ''}`}
                                />
                                {loading ? "Updating" : "Update"}

                            </button>
                        )}

                    </div>

                    {/* Botón actualizar */}

                </nav>
            </div>
        </div>
    );
};
