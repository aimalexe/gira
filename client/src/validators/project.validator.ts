import * as Yup from 'yup';

export const CreateProjectSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    description: Yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
    members: Yup.array().of(Yup.string()).min(1, 'At least one member is required'),
});

export const UpdateProjectSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name must be at least 2 characters'),
    description: Yup.string().min(10, 'Description must be at least 10 characters'),
});