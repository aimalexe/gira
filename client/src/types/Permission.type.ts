export interface Permission {
    Id: string;
    name: string;
};

export type GroupedPermissions = Record<string, Permission[]>;