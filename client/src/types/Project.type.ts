import { UserWithUnderscoreId } from "./User.type";

export interface Project {
    _id: string;
    name: string;
    description?: string;
    members?: Pick<UserWithUnderscoreId, "name" | "_id">[]
}