"use client";

import { Task } from "@/types/Task.type";
import TaskForm from "./TaskForm";
import { FormikHelpers } from "formik";
import { User } from "@/types/User.type";
import { UpdateTaskSchema } from "@/validators/task.validator";

interface TaskListItemProps {
    task: Task;
    editingTaskId: string | null;
    setEditingTaskId: (id: string | null) => void;
    handleUpdateTask: (values: any, actions: FormikHelpers<any>) => void;
    handleDeleteTask: (taskId: string) => void;
    users: Pick<User, "name" | "Id">[];
}

export default function TaskListItem({
    task,
    editingTaskId,
    setEditingTaskId,
    handleUpdateTask,
    handleDeleteTask,
    users,
}: TaskListItemProps) {
    const isEditing = editingTaskId === task.Id;

    return (
        <div className="p-4 border rounded-md bg-gray-100">
            {isEditing ? (
                <TaskForm
                    initialValues={{
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        assignedTo: task.assignedTo,
                        dueDate: task.dueDate.split("T")[0],
                        fileAttachment: task.fileAttachment,
                        projectId: task.projectId,
                    }}
                    validationSchema={UpdateTaskSchema}
                    onSubmit={handleUpdateTask}
                    isSubmitting={false}
                    isCreate={false}
                    users={users}
                />
            ) : (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h3 className="text-lg font-medium text-indigo-800">
                            {task.title}
                        </h3>
                        <p className="text-gray-600">{task.description}</p>
                        <p className="text-gray-600">Status: {task.status}</p>
                        <p className="text-gray-600">
                            Assigned To:{" "}
                            {users.find((u) => u.Id === task.assignedTo?.Id)
                                ?.name || "Unassigned"}
                        </p>
                        <p className="text-gray-600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        {task.fileAttachment && (
                            <a
                                href={task.fileAttachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-500 underline"
                            >
                                View Attachment
                            </a>
                        )}
                    </div>
                    <div className="space-x-2 mt-2 md:mt-0">
                        <button
                            onClick={() => setEditingTaskId(task.Id)}
                            className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteTask(task.Id)}
                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
