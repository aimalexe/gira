"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import api from "@/lib/api";
import TaskCard from "@/components/TaskCard";
import {
    CreateTaskSchema,
    UpdateTaskSchema,
} from "@/validators/task.validator";
import { User } from "@/types/User.type";
import { Task } from "@/types/Task.type";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import TaskForm from "@/components/TaskForm";
import Pagination from "@/components/Pagination";
import { FormikHelpers } from "formik";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

export default function TaskPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId") || "";
    const members: Pick<User, "Id" | "name">[] = JSON.parse(
        searchParams.get("members") ?? "[]"
    );
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        pageNo: 1,
        limit: 10,
        itemsPerPage: 10,
    });
    const [filters, setFilters] = useState<{
        assignedTo?: string;
        status?: string;
    }>({
        assignedTo: "",
        status: "",
    });
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    useEffect(() => {
        if (user && projectId) {
            fetchTasks();
        } else {
            router.push("/login");
        }
    }, [user, projectId, pagination.pageNo, filters, router]);

    const fetchTasks = async () => {
        try {
            const params = {
                page: pagination.pageNo,
                limit: pagination.limit,
                ...filters,
            };
            if (params.assignedTo === "") delete params.assignedTo;
            if (params.status === "") delete params.status;

            const response = await api.get(`/task/${projectId}`, { params });
            setTasks(response.data.data || []);
            setPagination({
                total: response.data.pagination.total ?? 0,
                pageNo: response.data.pagination.page ?? 1,
                limit: response.data.pagination.limit ?? 10,
                itemsPerPage: 10,
            });
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch tasks");
        }
    };

    const handleCreateTask = async (
        values: any,
        { setSubmitting, resetForm }: FormikHelpers<any>
    ) => {
        try {
            const data = {
                title: values.title,
                description: values.description,
                status: values.status,
                assigned_to: values.assignedTo,
                due_date: values.dueDate,
                file_attachment: values.fileAttachment,
                project: projectId,
            };
            await api.post("/task", data);
            resetForm();
            fetchTasks();
            setError("");
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create task");
            setSubmitting(false);
        }
    };

    const handleUpdateTask = async (
        values: any,
        { setSubmitting }: FormikHelpers<any>
    ) => {
        try {
            const data = {
                title: values.title,
                description: values.description,
                status: values.status,
                assigned_to: values.assignedTo,
                due_date: values.dueDate,
                file_attachment: values.fileAttachment,
            };
            await api.put(`/task/${projectId}/${currentTask?.Id}`, data);
            setCurrentTask(null);
            fetchTasks();
            setError("");
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update task");
            setSubmitting(false);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                await api.delete(`/task/${projectId}/${taskId}`);
                fetchTasks();
            } catch (err: any) {
                setError(
                    err.response?.data?.message || "Failed to delete task"
                );
            }
        }
    };

    if (!user || !projectId) {
        return null;
    }

    return (
        <div className="w-full md:max-w-6xl mx-auto p-2">
            <div className="bg-white/80 backdrop-blur-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-8 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Task Management
                    </h1>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setCurrentTask(null);
                            setIsModalOpen(true);
                        }}
                    >
                        <PlusCircleIcon className="h-5 w-5 text-white" /> Create
                        New Task
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">
                        Filters
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned To
                            </label>
                            <select
                                value={filters.assignedTo}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        assignedTo: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            >
                                <option value="">All Members</option>
                                {members.map((member) => (
                                    <option key={member.Id} value={member.Id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        status: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.Id}
                                task={task}
                                onEdit={() => {
                                    setCurrentTask(task);
                                    setIsModalOpen(true);
                                }}
                                onDelete={() => handleDeleteTask(task.Id)}
                                members={members}
                            />
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                            No tasks found
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <Pagination
                        pagination={pagination}
                        setPagination={setPagination}
                    />
                </div>
            </div>

            {/* Task Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentTask(null);
                }}
                title={
                    currentTask
                        ? `Edit Task: ${currentTask.title}`
                        : "Create New Task"
                }
            >
                <TaskForm
                    initialValues={{
                        title: currentTask?.title || "",
                        description: currentTask?.description || "",
                        status: currentTask?.status || "To Do",
                        assignedTo: currentTask?.assignedTo?.Id ?? "",
                        dueDate: currentTask?.dueDate?.split("T")[0] || "",
                        fileAttachment: currentTask?.fileAttachment || "",
                        projectId: projectId,
                    }}
                    validationSchema={
                        currentTask ? UpdateTaskSchema : CreateTaskSchema
                    }
                    onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
                    isSubmitting={false}
                    isCreate={!currentTask}
                    users={members}
                />
            </Modal>
        </div>
    );
}
