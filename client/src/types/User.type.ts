import { Permission } from "./Permission.type";

export interface User {
    Id: string;
    name?: string;
    email?: string;
    role: {
        name: string;
        Id: string;
        permissions: Permission[];
    };
}