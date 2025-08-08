import * as Yup from 'yup';

export const CreateTaskSchema = Yup.object().shape({
    title: Yup.string().min(2, 'Title must be at least 2 characters').required('Title is required'),
    description: Yup.string().min(10, 'Description must be at least 10 characters').default("To Do").optional(),
    status: Yup.string().oneOf(['To Do', 'In Progress', 'Done', 'Blocked'], 'Invalid status').optional(),
    assignedTo: Yup.string().required('Assigned To is required'),
    dueDate: Yup.date().required('Due Date is required'),
    projectId: Yup.string().required('Project ID is required'),
});

export const UpdateTaskSchema = Yup.object().shape({
    title: Yup.string().min(2, 'Title must be at least 2 characters'),
    description: Yup.string().min(10, 'Description must be at least 10 characters'),
    status: Yup.string().oneOf(['To Do', 'In Progress', 'Done', 'Blocked'], 'Invalid status'),
    assignedTo: Yup.string(),
    dueDate: Yup.date(),
    projectId: Yup.string(),
});