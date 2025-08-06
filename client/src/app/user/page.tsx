'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormikHelpers } from 'formik';
import { useAuthStore } from '@/lib/auth';
import api from '@/lib/api';
import UserForm from '@/components/UserForm';
import UserListItem from '@/components/UserListItem';
import Pagination from '@/components/Pagination';
import { CreateUserSchema, UpdateUserSchema } from '@/validators/user.validator'
import { User } from '@/types/User.type';

export default function UsersPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    console.log("🚀 ~ UsersPage ~ users:", users)
    const [pagination, setPagination] = useState({ total: 0, pageNo: 1, limit: 5, itemsPerPage: 1 });
    const [error, setError] = useState('');
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchUsers();
        } else if (!user) {
            router.push('/login');
        } else {
            router.push('/login');
        }
    }, [user, pagination.pageNo, router]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/user', {
                params: { page: pagination.pageNo, limit: pagination.limit },
            });
            setUsers(response.data.users);
            setPagination(response.data.pagination);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        }
    };

    const handleCreateUser = async (values: { name: string; email: string; password: string; role: 'admin' | 'user' }, { setSubmitting, resetForm }: FormikHelpers<any>) => {
        try {
            await api.post('/user', values);
            resetForm();
            fetchUsers();
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create user');
            setSubmitting(false);
        }
    };

    const handleUpdateUser = async (values: { name?: string; email?: string; password?: string; role?: 'admin' | 'user' }, { setSubmitting }: FormikHelpers<any>) => {
        try {
            if (values.password === "") delete values.password;
            await api.put(`/user/${editingUserId}`, values);
            setEditingUserId(null);
            fetchUsers();
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update user');
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/user/${userId}`);
                fetchUsers();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-soft rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800 font-michroma">Manage Users</h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-indigo-800">Create New User</h2>
                <UserForm
                    initialValues={{ name: '', email: '', password: 'password123', role: 'user' }}
                    validationSchema={CreateUserSchema}
                    onSubmit={handleCreateUser}
                    isSubmitting={false}
                    isCreate={true}
                />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">Users</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <div className="space-y-4">
                {users.map((user) => (
                    <UserListItem
                        key={user.Id}
                        user={user}
                        editingUserId={editingUserId}
                        setEditingUserId={setEditingUserId}
                        handleUpdateUser={handleUpdateUser}
                        handleDeleteUser={handleDeleteUser}
                    />
                ))}
            </div>
            <Pagination pagination={pagination} setPagination={setPagination} />
        </div>
    );
}