"use client";

import { useEffect, useState } from 'react';
import { Download, RefreshCw, FileText } from 'lucide-react';

interface FileItem {
    name: string;
    download_url: string;
}

export default function FileList() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    const fetchFiles = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/file-support/list-converted');
            if (!response.ok) throw new Error('Failed to fetch files');

            const data = await response.json();
            if (data.ok === false) throw new Error(data.error || 'Failed to fetch files');

            const fileList = Array.isArray(data) ? data : data.files || [];
            setFiles(fileList.map((filename: string) => ({
                name: filename,
                download_url: `/api/file-support/download-quote?file=${filename}`,
            })));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleRefresh = () => {
        fetchFiles();
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="ml-2 text-gray-600">Loading files...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">Error: {error}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Processed Files</h2>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 text-red-600 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {files.length === 0 ? (
                <div className="py-8 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No files available</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Processed files will appear here
                    </p>
                </div>
            ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    File Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {/* Actions */}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {files.map((file) => (
                                <tr key={file.name} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap max-w-sm truncate">
                                        <div className="flex items-center">
                                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm font-medium text-gray-900 break-all">
                                                {file.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <a
                                            href={file.download_url}
                                            download
                                            className="inline-flex items-center gap-1 px-3 py-1 text-gray-400 rounded hover:bg-blue-700 transition-colors"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
