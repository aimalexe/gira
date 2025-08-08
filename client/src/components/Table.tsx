"use client";

interface TableProps {
    headers: string[];
    children: React.ReactNode;
    className?: string;
}

export const Table = ({ headers, children, className = "" }: TableProps) => {
    return (
        <div className={`overflow-x-auto rounded-lg border border-gray-200 shadow-sm ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {children}
                </tbody>
            </table>
        </div>
    );
};

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
}

export const TableRow = ({ children, className = "" }: TableRowProps) => {
    return (
        <tr className={`hover:bg-gray-50 transition-colors duration-150 ${className}`}>
            {children}
        </tr>
    );
};

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}

export const TableCell = ({ children, className = "", ...props}: TableCellProps) => {
    return (
        <td className={`px-6 py-4 whitespace-nowrap text-gray-700 ${className}`} {...props}>
            {children}
        </td>
    );
};