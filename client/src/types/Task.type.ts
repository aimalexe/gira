import { UserWithUnderscoreId } from "./User.type";

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Done' | 'Blocked';
    assignedTo: UserWithUnderscoreId['_id'];
    dueDate: string; 
    fileAttachment?: string;
    projectId: string;
}