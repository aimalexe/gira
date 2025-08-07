"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { User } from "@/types/User.type";
import { Button } from "@/components/Button";

interface TaskFormProps {
    initialValues: {
        title: string;
        description: string;
        status: string;
        assignedTo: string;
        dueDate: string;
        fileAttachment: string;
        projectId: string;
    };
    validationSchema: any;
    onSubmit: (values: any, actions: any) => void;
    isSubmitting: boolean;
    isCreate?: boolean;
    users: Pick<User, "name" | "Id">[];
}

export default function TaskForm({
    initialValues,
    validationSchema,
    onSubmit,
    isSubmitting,
    isCreate,
    users = [],
}: TaskFormProps) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {() => (
                <Form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Title
                            </label>
                            <Field
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Task title"
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            />
                            <ErrorMessage
                                name="title"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Description
                            </label>
                            <Field
                                as="textarea"
                                id="description"
                                name="description"
                                placeholder="Task description"
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent min-h-[100px]"
                            />
                            <ErrorMessage
                                name="description"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Status
                                </label>
                                <Field
                                    as="select"
                                    id="status"
                                    name="status"
                                    className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                    <option value="Blocked">Blocked</option>
                                </Field>
                                <ErrorMessage
                                    name="status"
                                    component="p"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="assignedTo"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Assigned To
                                </label>
                                <Field
                                    as="select"
                                    id="assignedTo"
                                    name="assignedTo"
                                    className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                >
                                    <option value="">Unassigned</option>
                                    {users.map((user) => (
                                        <option key={user.Id} value={user.Id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="assignedTo"
                                    component="p"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="dueDate"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Due Date
                                </label>
                                <Field
                                    id="dueDate"
                                    name="dueDate"
                                    type="date"
                                    className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                />
                                <ErrorMessage
                                    name="dueDate"
                                    component="p"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="fileAttachment"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    File Attachment (URL)
                                </label>
                                <Field
                                    id="fileAttachment"
                                    name="fileAttachment"
                                    type="url"
                                    placeholder="Optional file URL"
                                    className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                />
                                <ErrorMessage
                                    name="fileAttachment"
                                    component="p"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            {isCreate ? "Create Task" : "Update Task"}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}