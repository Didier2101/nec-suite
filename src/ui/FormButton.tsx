// components/ui/FormButton.tsx
import React from "react";
import { FormButtonProps } from "@/types/forms";

export const FormButton: React.FC<FormButtonProps> = ({
    type = "button",
    size = "md",
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = "left",
    className = "",
    children,
    onClick,
}) => {
    const baseClasses = "bg-blue-800 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";


    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-6 py-4 text-lg"
    };

    const finalClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `;



    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={finalClasses}
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                </>
            ) : (
                <>
                    {Icon && iconPosition === "left" && <Icon size={18} className="mr-2" />}
                    {children}
                    {Icon && iconPosition === "right" && <Icon size={18} className="ml-2" />}
                </>
            )}
        </button>
    );
};