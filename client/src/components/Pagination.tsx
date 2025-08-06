"use client";

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

    return (
        <div className="mt-4 flex justify-between">
            <button
                disabled={pagination.pageNo === 1}
                onClick={() =>
                    setPagination({
                        ...pagination,
                        pageNo: pagination.pageNo - 1,
                    })
                }
                className="p-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-gray-700">
                Page {pagination.pageNo} of {totalPages}
            </span>
            <button
                disabled={pagination.pageNo === totalPages}
                onClick={() =>
                    setPagination({
                        ...pagination,
                        pageNo: pagination.pageNo + 1,
                    })
                }
                className="p-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
