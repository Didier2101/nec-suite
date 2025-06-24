// components/ui/FormInput.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormInputProps } from "@/types/forms";
import { FieldValues } from "react-hook-form";
import ErrorInput from "./ErrorInput";

export function FormInput<T extends FieldValues>({
    label,
    name,
    register,
    error,
    type = "text",
    placeholder,
    required = false,
    icon: Icon,
    showPasswordToggle = false,
    className = "",
    disabled = false,

}: FormInputProps<T>) {

    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-900  mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                )}

                <input
                    type={inputType}
                    {...register(name)}
                    disabled={disabled}
                    className={`
            w-full ${Icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-2' : 'pr-4'} py-3 
            rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent 
            transition-colors
            ${error ? 'border-red-500' : 'border-gray-100 '}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                    placeholder={placeholder}
                />

                {showPasswordToggle && type === "password" && (
                    <button
                        type="button"
                        className="absolute  right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {error && (
                <ErrorInput error={error} />
            )}
        </div>
    );
}