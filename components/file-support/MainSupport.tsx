"use client";

import FileUploader from "./FileUploader";
import FileList from "./FileList";

export default function MainSupport() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploader />
            <FileList />

        </div>
    )
}