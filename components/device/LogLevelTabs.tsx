import React from 'react';
import { LogLevel } from '@/types/device';

interface LogLevelTabsProps {
    selected: LogLevel | 'all';
    onChange: (level: LogLevel | 'all') => void;
}

const levels: (LogLevel | 'all')[] = ['all', 'critical', 'error', 'warning', 'info', 'debug'];

export default function LogLevelTabs({ selected, onChange }: LogLevelTabsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {levels.map(level => (
                <button
                    key={level}
                    onClick={() => onChange(level)}
                    className={`px-4 py-1 rounded-full text-sm font-medium border transition
            ${selected === level
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}
          `}
                >
                    {level === 'all' ? 'All' : level.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
