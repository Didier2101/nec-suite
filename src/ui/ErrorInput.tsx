import { AlertTriangle } from "lucide-react";
import React from "react";
import { FieldError } from "react-hook-form";

interface ErrorInputProps {
    error?: FieldError;
}

export default function ErrorInput({ error }: ErrorInputProps) {
    if (!error?.message) return null; // no muestra nada si no hay mensaje

    return (
        <p className="mt-1 text-xs text-red-500 flex items-center">
            <AlertTriangle size={14} className="mr-1" />
            {error.message}
        </p>
    );
}
