// components/ui/file-uploader.tsx
"use client";

import { useCallback, useState } from "react";
import { UploadCloud } from "lucide-react";
import { FormButton } from "./FormButton";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    acceptedTypes?: string[];
    maxSize?: number; // in bytes
    className?: string;
}

export function FileUploader({
    onFileSelect,
    acceptedTypes = [],
    maxSize = 5 * 1024 * 1024, // 5MB default
    className = "",
}: FileUploaderProps) {
    const [fileError, setFileError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: any[]) => {
            setIsDragging(false);
            setFileError(null);

            if (fileRejections.length > 0) {
                const rejection = fileRejections[0];
                if (rejection.errors[0].code === "file-too-large") {
                    setFileError(`El archivo es muy grande (máx. ${maxSize / 1024 / 1024}MB)`);
                } else {
                    setFileError(rejection.errors[0].message);
                }
                return;
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setSelectedFile(file);
                onFileSelect(file);
            }
        },
        [onFileSelect, maxSize]
    );

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        accept: acceptedTypes.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as Record<string, string[]>),
        maxSize,
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
    });

    const removeFile = () => {
        setSelectedFile(null);
        setFileError(null);
    };

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? "border-primary bg-primary/10" : "border-muted"
                } ${className}`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <UploadCloud
                    className={`h-12 w-12 ${isDragging ? "text-primary" : "text-muted-foreground"
                        }`}
                />

                <div className="space-y-1">
                    <p className="text-sm font-medium">
                        {selectedFile
                            ? "Archivo seleccionado:"
                            : isDragging
                                ? "Suelta el archivo aquí"
                                : "Arrastra y suelta tu archivo aquí"}
                    </p>

                    {selectedFile ? (
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-sm text-muted-foreground">
                                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="text-sm text-destructive hover:underline"
                            >
                                Eliminar
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            O haz clic para seleccionar un archivo
                        </p>
                    )}

                    {fileError && (
                        <p className="text-sm text-destructive">{fileError}</p>
                    )}
                </div>

                <FormButton
                    type="button"
                    onClick={open}
                    className="mt-2"
                >
                    Seleccionar archivo
                </FormButton>

                {acceptedTypes.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        Formatos aceptados: {acceptedTypes.join(", ")}
                    </p>
                )}
            </div>
        </div>
    );
}