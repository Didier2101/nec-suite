import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const createPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 4) pages.push('...');

            const start = Math.max(2, currentPage - 2);
            const end = Math.min(totalPages - 1, currentPage + 2);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 3) pages.push('...');

            pages.push(totalPages);
        }

        return pages;
    };

    const pagesToDisplay = createPageNumbers();

    return (
        <div className="flex items-center justify-center space-x-1 mt-4 flex-wrap">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
                Prev
            </button>

            {pagesToDisplay.map((page, idx) =>
                typeof page === 'number' ? (
                    <button
                        key={idx}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 border rounded text-sm ${page === currentPage
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={idx} className="px-2 py-1 text-gray-500 text-sm">
                        ...
                    </span>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
