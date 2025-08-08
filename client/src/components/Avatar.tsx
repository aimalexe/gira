"use client";

interface AvatarProps {
    name: string;
    size?: "sm" | "md" | "lg";
}

export default function Avatar({ name, size = "md" }: AvatarProps) {
    const initials = name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
    };

    const colors = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-yellow-100 text-yellow-800",
        "bg-red-100 text-red-800",
        "bg-purple-100 text-purple-800",
        "bg-pink-100 text-pink-800",
        "bg-indigo-100 text-indigo-800",
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const colorClass = colors[colorIndex];

    return (
        <div
            className={`inline-flex items-center justify-center rounded-full ${sizeClasses[size]} ${colorClass}`}
        >
            {initials}
        </div>
    );
}
