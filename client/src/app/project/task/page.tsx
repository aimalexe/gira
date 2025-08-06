"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormikHelpers } from "formik";
import { useAuthStore } from "@/lib/auth";
import api from "@/lib/api";
import TaskForm from "@/components/TaskForm";
import TaskListItem from "@/components/TaskListItem";
import Pagination from "@/components/Pagination";
import { CreateTaskSchema } from "@/validators/task.validator";
import { User } from "@/types/User.type";
import { Task } from "@/types/Task.type";

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
        limit: 5,
        itemsPerPage: 1,
    });
    const [filters, setFilters] = useState<{
        assignedTo?: string;
        status?: string;
    }>({ assignedTo: "", status: "" });
    const [error, setError] = useState("");
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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
            console.log("🚀 ~ fetchTasks ~ err:", err);
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
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create task");
            setSubmitting(false);
        }
    };

    const handleUpdateTask = async (
        values: any,
        { setSubmitting }: FormikHelpers<any>
    ) => {
        const data = {
            title: values.title,
            description: values.description,
            status: values.status,
            assigned_to: values.assignedTo,
            due_date: values.dueDate,
            fileAttachment: values.fileAttachment,
            project: values.project,
        };
        try {
            await api.put(`/task/${projectId}/${editingTaskId}`, data);
            setEditingTaskId(null);
            fetchTasks();
            setError("");
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
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800 font-michroma">
                Manage Tasks for Project
            </h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-indigo-800">
                    Create New Task
                </h2>
                <TaskForm
                    initialValues={{
                        title: "",
                        description: "",
                        status: "To Do",
                        dueDate: "",
                        fileAttachment: "",
                        projectId,
                    }}
                    validationSchema={CreateTaskSchema}
                    onSubmit={handleCreateTask}
                    isSubmitting={false}
                    isCreate={true}
                    users={members}
                />
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 text-indigo-800">
                    Filters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="filterAssignedTo"
                            className="block text-sm font-medium text-indigo-800"
                        >
                            Assigned To
                        </label>
                        <select
                            id="filterAssignedTo"
                            value={filters.assignedTo}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    assignedTo: e.target.value,
                                })
                            }
                            className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                        >
                            <option value="">All</option>
                            {members.map((member) => (
                                <option key={member.Id} value={member.Id}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="filterStatus"
                            className="block text-sm font-medium text-indigo-800"
                        >
                            Status
                        </label>
                        <select
                            id="filterStatus"
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    status: e.target.value,
                                })
                            }
                            className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                        >
                            <option value="">All</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                            <option value="Blocked">Blocked</option>
                        </select>
                    </div>
                </div>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">
                Tasks
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
                {tasks.map((task) => (
                    <TaskListItem
                        key={task.Id}
                        task={task}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                        handleUpdateTask={handleUpdateTask}
                        handleDeleteTask={handleDeleteTask}
                        users={members}
                    />
                ))}
            </div>
            <Pagination pagination={pagination} setPagination={setPagination} />
        </div>
    );
}
