'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormikHelpers } from 'formik';
import { useAuthStore } from '@/lib/auth';
import api from '@/lib/api';
import ProjectForm from '@/components/ProjectForm';
import ProjectListItem from '@/components/ProjectListItem';
import { CreateProjectSchema} from '@/validators/project.validator';
import { Project } from '@/types/Project.type';

export default function ProjectsPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);
    const [error, setError] = useState('');
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                fetchProjects();
                fetchUsers();
            } else if (user.role === 'user') {
                fetchProjects();
            }
        } else {
            router.push('/login');
        }
    }, [user, router]);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/project');
            setProjects(response.data.data || []);
            setError('');
        } catch (err: any) {
            console.log('🚀 ~ fetchProjects ~ err:', err);
            setError(err.response?.data?.message || 'Failed to fetch projects');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/user', { params: { limit: 100 } });
            setUsers(response.data.users.map((u: any) => ({ _id: u._id, name: u.name })));
        } catch (err: any) {
            console.log('Failed to fetch users:', err);
        }
    };

    const handleCreateProject = async (
        values: { name: string; description: string; members: string[] },
        { setSubmitting, resetForm }: FormikHelpers<any>
    ) => {
        if (user?.role !== 'admin') return; // Restrict create to admin
        try {
            await api.post('/project', values);
            resetForm();
            fetchProjects();
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create project');
            setSubmitting(false);
        }
    };

    const handleUpdateProject = async (
        values: { name?: string; description?: string; members?: string[] },
        { setSubmitting }: FormikHelpers<any>
    ) => {
        if (user?.role !== 'admin') return; // Restrict update to admin
        try {
            if (values.members && values.members.length > 0) delete values.members;
            await api.put(`/project/${editingProjectId}`, values);
            setEditingProjectId(null);
            fetchProjects();
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update project');
            setSubmitting(false);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (user?.role !== 'admin') return; // Restrict delete to admin
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/project/${projectId}`);
                fetchProjects();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to delete project');
            }
        }
    };

    const handleAddMember = async (projectId: string, memberId: string) => {
        if (user?.role !== 'admin') return; // Restrict add member to admin
        if (memberId) {
            try {
                await api.post(`/project/${projectId}/members`, { userIds: [memberId] });
                fetchProjects();
            } catch (err: any) {
                console.log('🚀 ~ handleAddMember ~ err:', err);
                setError(err.response?.data?.message || 'Failed to add member');
            }
        }
    };

    const handleRemoveMember = async (projectId: string, memberId: string) => {
        if (user?.role !== 'admin') return; // Restrict remove member to admin
        if (memberId) {
            try {
                await api.delete(`/project/${projectId}/members`, { data: { userIds: [memberId] } });
                fetchProjects();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to remove member');
            }
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
                Manage Projects
            </h1>
            {user.role === 'admin' && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-800">
                        Create New Project
                    </h2>
                    <ProjectForm
                        initialValues={{ name: '', description: '', members: [] }}
                        validationSchema={CreateProjectSchema}
                        onSubmit={handleCreateProject}
                        isSubmitting={false}
                        isCreate={true}
                        users={users}
                    />
                </div>
            )}
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">
                Projects
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
                {projects.map((project) => (
                    <ProjectListItem
                        key={project._id}
                        project={project}
                        editingProjectId={editingProjectId}
                        setEditingProjectId={setEditingProjectId}
                        handleUpdateProject={handleUpdateProject}
                        handleDeleteProject={handleDeleteProject}
                        handleAddMember={handleAddMember}
                        handleRemoveMember={handleRemoveMember}
                        users={users}
                    />
                ))}
            </div>
        </div>
    );
}

