'use client';
import React from 'react';

interface Option {
    label: string;
    value: string;
}

interface FormSelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: (string | Option)[];
    placeholder?: string;
    className?: string;
}

export const FormSelect = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Seleccione una opción',
    className = '',
}: FormSelectProps) => {
    return (
        <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                {label}
            </label>
            <select
                className={`w-full p-2 border rounded ${className}`}
                value={value}
                onChange={onChange}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) =>
                    typeof opt === 'string' ? (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ) : (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    )
                )}
            </select>
        </div>
    );
};
