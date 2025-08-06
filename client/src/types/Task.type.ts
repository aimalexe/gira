import { UserWithUnderscoreId } from "./User.type";

export interface Task {
    Id: string;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Done' | 'Blocked';
    assignedTo?: {
        Id: string;
        name: string
    }; 
    dueDate: string;
    fileAttachment: string;
    projectId: string;
}