import { UserWithUnderscoreId } from "./User.type";

export interface Project {
    Id: string;
    name: string;
    description?: string;
    members?: {
        Id: string;
        name: string;
    }[]
}