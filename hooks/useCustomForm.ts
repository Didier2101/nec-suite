"use client";

import { useForm, UseFormProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodTypeAny } from "zod";

interface UseCustomFormProps<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
    schema: ZodTypeAny;
}

export const useCustomForm = <T extends FieldValues>({
    schema,
    mode = "all",
    ...props
}: UseCustomFormProps<T>) => {
    return useForm<T>({
        resolver: zodResolver(schema),
        mode,
        ...props,
    });
};
