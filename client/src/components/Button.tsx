"use client";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

export const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    disabled = false,
    isLoading = false,
}: ButtonProps) => {
    const baseClasses =
        "px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2";

    const variantClasses = {
        primary:
            "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md",
        secondary:
            "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-sm",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
        success: "bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-md",
        ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseClasses} ${variantClasses[variant]} ${className} ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin h-4 w-4 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Processing...
                </>
            ) : (
                children
            )}
        </button>
    );
};