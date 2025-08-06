"use client";

import { Project } from "@/types/Project.type";
import ProjectForm from "./ProjectForm";
import { FormikHelpers } from "formik";
import { UpdateProjectSchema } from "@/validators/project.validator";
import { UserWithUnderscoreId } from "@/types/User.type";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";

interface ProjectListItemProps {
    project: Project;
    editingProjectId: string | null;
    setEditingProjectId: (id: string | null) => void;
    handleUpdateProject: (values: any, actions: FormikHelpers<any>) => void;
    handleDeleteProject: (projectId: string) => void;
    handleAddMember: (projectId: string, memberIds: string) => void;
    handleRemoveMember: (projectId: string, memberId: string) => void;
    users?: Pick<UserWithUnderscoreId, "name" | "_id">[];
}

export default function ProjectListItem({
    project,
    editingProjectId,
    setEditingProjectId,
    handleUpdateProject,
    handleDeleteProject,
    handleAddMember,
    handleRemoveMember,
    users = [],
}: ProjectListItemProps) {
    const isEditing = editingProjectId === project._id;
    const { user } = useAuthStore();

    return (
        <div className="p-4 border rounded-md bg-gray-100">
            {isEditing ? (
                <ProjectForm
                    initialValues={{
                        name: project.name,
                        description: project.description,
                        members: project.members?.map((m) => ({
                            _id: m._id,
                            name: m.name,
                        })),
                    }}
                    validationSchema={UpdateProjectSchema}
                    onSubmit={handleUpdateProject}
                    isSubmitting={false}
                    isCreate={false}
                    users={users}
                />
            ) : (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <Link
                            href={`/project/task?projectId=${
                                project._id
                            }&members=${JSON.stringify(
                                project.members?.map(({ _id, name }) => ({
                                    _id,
                                    name,
                                }))
                            )}`}
                        >
                            <h3 className="text-lg font-medium text-indigo-800">
                                {project.name}
                            </h3>
                        </Link>
                        <p className="text-gray-600">{project.description}</p>
                        <div className="mt-2">
                            <h4 className="text-md font-medium text-indigo-800">
                                Members:
                            </h4>
                            <ul className="list-disc list-inside text-gray-600">
                                {project.members?.map((member) => (
                                    <li key={member._id}>{member.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {user?.role === "admin" && (
                        <div className="space-x-2 mt-2 md:mt-0 grid grid-col-2 gap-2">
                            <select
                                onChange={(e) => {
                                    const memberId = e.target.value;
                                    if (memberId) {
                                        handleAddMember(project._id, memberId);
                                        e.target.value = ""; // Reset to default after selection
                                    }
                                }}
                                className="p-2 border rounded-md focus:ring focus:ring-teal-500 col-span-2"
                            >
                                <option value="">Add Member</option>
                                {users
                                    .filter(
                                        (user) =>
                                            !project.members?.some(
                                                (m) => m._id === user._id
                                            )
                                    )
                                    .map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.name}
                                        </option>
                                    ))}
                            </select>
                            <button
                                onClick={() => setEditingProjectId(project._id)}
                                className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 col-span-1"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                            {project.members && project.members.length > 0 && (
                                <select
                                    onChange={(e) => {
                                        const memberId = e.target.value;
                                        if (memberId) {
                                            handleRemoveMember(
                                                project._id,
                                                memberId
                                            );
                                            e.target.value = ""; // Reset to default after selection
                                        }
                                    }}
                                    className="p-2 border rounded-md focus:ring focus:ring-red-500 col-span-2"
                                >
                                    <option value="">Remove Member</option>
                                    {project.members?.map((member) => (
                                        <option
                                            key={member._id}
                                            value={member._id}
                                        >
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
