"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { User } from "@/types/User.type";
import { Task } from "@/types/Task.type";

interface TaskFormProps {
    initialValues: Omit<Task, "Id">;
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-indigo-800"
                            >
                                Title
                            </label>
                            <Field
                                id="title"
                                name="title"
                                type="text"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                            />
                            <ErrorMessage
                                name="title"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="assignedTo"
                                className="block text-sm font-medium text-indigo-800"
                            >
                                Assigned To
                            </label>
                            <Field
                                as="select"
                                id="assignedTo"
                                name="assignedTo"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                            >
                                <option value="">Select User</option>
                                {users.map((user) => (
                                    <option key={user.Id} value={user.Id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage
                                name="assignedTo"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-indigo-800"
                        >
                            Description
                        </label>
                        <Field
                            as="textarea"
                            id="description"
                            name="description"
                            className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                        />
                        <ErrorMessage
                            name="description"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-indigo-800"
                            >
                                Status
                            </label>
                            <Field
                                as="select"
                                id="status"
                                name="status"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                                <option value="Blocked">Blocked</option>
                            </Field>
                            <ErrorMessage
                                name="status"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="dueDate"
                                className="block text-sm font-medium text-indigo-800"
                            >
                                Due Date
                            </label>
                            <Field
                                id="dueDate"
                                name="dueDate"
                                type="date"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                            />
                            <ErrorMessage
                                name="dueDate"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="fileAttachment"
                            className="block text-sm font-medium text-indigo-800"
                        >
                            File Attachment (URL)
                        </label>
                        <Field
                            id="fileAttachment"
                            name="fileAttachment"
                            type="url"
                            className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                            placeholder="Optional file URL"
                        />
                        <ErrorMessage
                            name="fileAttachment"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`mx-auto w-[50%] p-2 ${
                            isCreate ? "bg-teal-500" : "bg-indigo-600"
                        } text-white rounded-md hover:bg-opacity-90 disabled:opacity-50`}
                    >
                        {isSubmitting
                            ? isCreate
                                ? "Creating..."
                                : "Updating..."
                            : isCreate
                            ? "Create Task"
                            : "Update"}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
