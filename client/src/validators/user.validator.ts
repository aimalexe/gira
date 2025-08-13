import * as Yup from 'yup';

export const CreateUserSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required(),
    role: Yup.string().required('Role is required'),
});

export const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name must be at least 2 characters'),
    email: Yup.string().email('Invalid email'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').optional(),
    role: Yup.string().required('Role is required'),
});