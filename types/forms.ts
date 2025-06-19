

// types/forms.ts
import { FieldError, UseFormRegister, Path, FieldValues } from "react-hook-form";
import { LucideIcon } from "lucide-react";

export interface BaseFormInputProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: FieldError;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export interface FormInputProps<T extends FieldValues> extends BaseFormInputProps<T> {
    type?: "text" | "email" | "password" | "tel" | "number" | "date";
    placeholder?: string;
    icon?: LucideIcon;
    showPasswordToggle?: boolean;
}

export interface FormButtonProps {
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    icon?: LucideIcon;
    iconPosition?: "left" | "right";
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}
