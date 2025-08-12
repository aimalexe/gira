"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import api from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";
import {
    CreateProjectSchema,
    UpdateProjectSchema,
} from "@/validators/project.validator";
import { Project } from "@/types/Project.type";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { FormikHelpers } from "formik";
import { FolderPlusIcon } from "@heroicons/react/20/solid";
import { ConfirmModal } from "@/components/ConfirmModal";

export default function ProjectsPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<{ Id: string; name: string }[]>([]);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);

    // Confirm states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmVariant, setConfirmVariant] = useState<
        "primary" | "secondary" | "danger" | "success" | "ghost"
    >("primary");

    useEffect(() => {
        if (user) {
            if (user.role.name === "admin") {
                fetchProjects();
                fetchUsers();
            } else if (user.role.name === "user") {
                fetchProjects();
            }
        } else {
            router.push("/login");
        }
    }, [user, router]);

    const fetchProjects = async () => {
        try {
            const response = await api.get("/project");
            setProjects(response.data.data || []);
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch projects");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get("/user", { params: { limit: 100 } });
            setUsers(
                response.data.users.map((u: any) => ({
                    Id: u.Id,
                    name: u.name,
                }))
            );
        } catch (err: any) {
            console.log("Failed to fetch users:", err);
        }
    };

    const handleCreateProject = async (
        values: { name: string; description: string; members: string[] },
        { setSubmitting, resetForm }: FormikHelpers<any>
    ) => {
        if (user?.role.name !== "admin") return;
        try {
            await api.post("/project", values);
            resetForm();
            fetchProjects();
            setError("");
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create project");
            setSubmitting(false);
        }
    };

    const handleUpdateProject = async (
        values: { name?: string; description?: string; members?: string[] },
        { setSubmitting }: FormikHelpers<any>
    ) => {
        if (!currentProject || user?.role.name !== "admin") return;
        try {
            if (values.members && values.members.length > 0)
                delete values.members;
            await api.put(`/project/${currentProject.Id}`, values);
            setCurrentProject(null);
            fetchProjects();
            setError("");
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update project");
            setSubmitting(false);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (user?.role.name !== "admin") return;
        setConfirmTitle("Delete Project");
        setConfirmMessage("Are you sure you want to delete this project?");
        setConfirmVariant("danger");
        setConfirmAction(() => async () => {
            try {
                await api.delete(`/project/${projectId}`);
                fetchProjects();
            } catch (err: any) {
                setError(
                    err.response?.data?.message || "Failed to delete project"
                );
            }
        });
        setConfirmOpen(true);
    };

    const handleAddMember = async (projectId: string, memberId: string) => {
        if (user?.role.name !== "admin") return;
        setConfirmTitle("Add Team Member");
        setConfirmMessage("Are you sure you want to add this user?");
        setConfirmVariant("success");
        setConfirmAction(() => async () => {
            if (memberId) {
                try {
                    await api.post(`/project/${projectId}/members`, {
                        userIds: [memberId],
                    });
                    fetchProjects();
                } catch (err: any) {
                    setError(
                        err.response?.data?.message || "Failed to add member"
                    );
                }
            }
        });
        setConfirmOpen(true);
    };

    const handleRemoveMember = async (projectId: string, memberId: string) => {
        if (user?.role.name !== "admin") return;
        setConfirmTitle("Remove Team Member");
        setConfirmMessage("Are you sure you want to remove this user?");
        setConfirmVariant("danger");
        setConfirmAction(() => async () => {
            if (memberId) {
                try {
                    await api.delete(`/project/${projectId}/members`, {
                        data: { userIds: [memberId] },
                    });
                    fetchProjects();
                } catch (err: any) {
                    setError(
                        err.response?.data?.message || "Failed to remove member"
                    );
                }
            }
        });
        setConfirmOpen(true);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="w-full md:max-w-6xl mx-auto p-2">
            <div className="bg-white/80 backdrop-blur-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-8 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Project Management
                    </h1>
                    {user.role.name === "admin" && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                setCurrentProject(null);
                                setIsModalOpen(true);
                            }}
                        >
                            <FolderPlusIcon className="h-5 w-5 text-white" />{" "}
                            Create New Project
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <ProjectCard
                                key={project.Id}
                                project={project}
                                onEdit={() => {
                                    setCurrentProject(project);
                                    setIsModalOpen(true);
                                }}
                                onDelete={() => handleDeleteProject(project.Id)}
                                onAddMember={(memberId) =>
                                    handleAddMember(project.Id, memberId)
                                }
                                onRemoveMember={(memberId) =>
                                    handleRemoveMember(project.Id, memberId)
                                }
                                users={users}
                                currentUser={user}
                            />
                        ))
                    ) : (
                        <div className="col-span-full p-6 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                            No projects found
                        </div>
                    )}
                </div>
            </div>

            {/* Project Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentProject(null);
                }}
                title={
                    currentProject
                        ? `Edit ${currentProject.name}`
                        : "Create New Project"
                }
            >
                <ProjectForm
                    initialValues={{
                        name: currentProject?.name || "",
                        description: currentProject?.description || "",
                        members: currentProject?.members || [],
                    }}
                    validationSchema={
                        currentProject
                            ? UpdateProjectSchema
                            : CreateProjectSchema
                    }
                    onSubmit={
                        currentProject
                            ? handleUpdateProject
                            : handleCreateProject
                    }
                    isSubmitting={false}
                    isCreate={!currentProject}
                    users={users}
                />
            </Modal>
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmAction}
                title={confirmTitle}
                message={confirmMessage}
                confirmVariant={confirmVariant}
            />
        </div>
    );
}
