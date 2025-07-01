"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, CheckCircle, AlertCircle, X, File } from "lucide-react";

interface UploadStatus {
    loading: boolean;
    success: boolean;
    error: string | null;
}

export default function FileUploader() {
    const [status, setStatus] = useState<UploadStatus>({
        loading: false,
        success: false,
        error: null,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 0) return;
            setSelectedFile(acceptedFiles[0]);
        },
    });

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setStatus({
            loading: false,
            success: false,
            error: null,
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setStatus({
            loading: true,
            success: false,
            error: null,
        });

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("/api/file-support/upload-quote", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || "Error processing file");
            }

            setStatus({
                loading: false,
                success: true,
                error: null,
            });

            // ✅ Auto-reset after 1 second
            setTimeout(() => {
                setSelectedFile(null);
                setStatus({
                    loading: false,
                    success: false,
                    error: null,
                });
            }, 1000);

        } catch (error) {
            setStatus({
                loading: false,
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 space-y-4">
            {!selectedFile ? (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center ${isDragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-4">
                        <UploadCloud className="h-12 w-12 text-gray-400" />
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-700">
                                {isDragActive ? "Drop file here" : "Drag and drop file"}
                            </p>
                            <p className="text-sm text-gray-500">
                                Or click to select Excel (.xlsx, .xls) or CSV
                            </p>
                        </div>
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Select File
                        </button>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4 flex-wrap">
                        <div className="flex items-start gap-3 max-w-full overflow-hidden">
                            <File className="h-5 w-5 text-blue-500 mt-1" />
                            <div className="min-w-0">
                                <p className="font-medium text-gray-700 break-all max-w-[300px]">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveFile}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove file"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleRemoveFile}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={status.loading}
                        >
                            {status.loading ? "Processing..." : "Upload File"}
                        </button>
                    </div>
                </div>
            )}

            {/* Status indicators */}
            {status.loading && (
                <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <p className="text-blue-800">Processing file...</p>
                </div>
            )}

            {status.error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-red-800">Error: {status.error}</p>
                </div>
            )}

            {status.success && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-green-800">File processed successfully</p>
                </div>
            )}
        </div>
    );
}
