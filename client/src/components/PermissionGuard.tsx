import { User } from "@/types/User.type";
import { useState } from "react";

interface PermissionGuardProps {
    user: User;
    permission: string;
    mode?: "block" | "disable" | "hidden"; // default: hidden
    children: React.ReactNode;
}

export default function PermissionGuard({
    user,
    permission,
    mode = "hidden",
    children,
}: PermissionGuardProps) {
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const hasPermission = user?.role?.permissions?.some(
        (perm: any) => perm.name === permission
    );

    const handleClick = (e: React.MouseEvent) => {
        if (!hasPermission) {
            e.preventDefault();
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    return (
        <>
            {showAlert && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
                    You don't have permission for this action "{permission}".
                </div>
            )}

            {hasPermission ? (
                <>{children}</>
            ) : mode === "disable" ? (
                <div style={{ opacity: 0.5, pointerEvents: "none" }}>
                    {children}
                </div>
            ) : mode === "block" ? (
                <div onClick={handleClick}>{children}</div>
            ) : null}
        </>
    );
}
