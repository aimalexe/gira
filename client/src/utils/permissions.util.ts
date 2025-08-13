import { GroupedPermissions, Permission } from "@/types/Permission.type";

export function groupPermissions(permissionsData: Permission[]): GroupedPermissions {
    const grouped = permissionsData.reduce((acc, perm) => {
        const { Id, name } = perm;
        const [action, module] =
            name.includes(":") && name.split(":").length === 2
                ? name.split(":")
                : [name, "misc"];

        if (!acc[module]) acc[module] = [];
        acc[module].push({ Id, name: action });
        return acc;
    }, {} as GroupedPermissions);

    const sortedModules = Object.keys(grouped)
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc, module) => {
            acc[module] = grouped[module].sort((a, b) => a.name.localeCompare(b.name));
            return acc;
        }, {} as GroupedPermissions);

    return sortedModules;
}


export function checkPermission(user: any, permission: string, showAlert: boolean = true): boolean {
    const hasPerm = user?.role?.permissions?.some(
        (perm: any) => perm.name === permission
    );

    if (!hasPerm && showAlert) {
        // Show alert (browser alert or toast)
        if (typeof window !== "undefined") {
            const alertDiv = document.createElement("div");
            alertDiv.textContent = `You don't have permission for this action.${permission}`;
            alertDiv.style.position = "fixed";
            alertDiv.style.top = "20px";
            alertDiv.style.right = "20px";
            alertDiv.style.backgroundColor = "#EF4444"; // Tailwind red-500
            alertDiv.style.color = "white";
            alertDiv.style.padding = "8px 12px";
            alertDiv.style.borderRadius = "6px";
            alertDiv.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            alertDiv.style.zIndex = "9999";
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
        }
    }

    return hasPerm;
}
