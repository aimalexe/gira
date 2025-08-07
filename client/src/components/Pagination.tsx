"use client";

import { Button } from "@/components/Button";

interface PaginationProps {
    pagination: {
        total: number;
        pageNo: number;
        limit: number;
        itemsPerPage: number;
    };
    setPagination: (pagination: any) => void;
}

export default function Pagination({
    pagination,
    setPagination,
}: PaginationProps) {
    const totalPages = Math.ceil(pagination.total / pagination.itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPagination({
                ...pagination,
                pageNo: newPage,
            });
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(
            1,
            pagination.pageNo - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === pagination.pageNo ? "primary" : "ghost"}
                    onClick={() => handlePageChange(i)}
                    className={`min-w-[2.5rem] ${
                        i === pagination.pageNo ? "cursor-default" : ""
                    }`}
                >
                    {i}
                </Button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between mt-6 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-1 md:gap-2">
                <Button
                    variant="secondary"
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.pageNo === 1}
                    className="hidden md:block"
                >
                    First
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => handlePageChange(pagination.pageNo - 1)}
                    disabled={pagination.pageNo === 1}
                    className="text-sm md:text-base"
                >
                    Previous
                </Button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
                {renderPageNumbers()}
            </div>

            <div className="text-sm text-gray-600 px-4">
                Page {pagination.pageNo} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    onClick={() => handlePageChange(pagination.pageNo + 1)}
                    disabled={pagination.pageNo === totalPages}
                    className="text-sm md:text-base"
                >
                    Next
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={pagination.pageNo === totalPages}
                    className="hidden md:block"
                >
                    Last
                </Button>
            </div>
        </div>
    );
}