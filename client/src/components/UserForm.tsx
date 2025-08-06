"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface UserFormProps {
    initialValues: {
        name: string;
        email: string;
        password: string;
        role: "admin" | "user";
    };
    validationSchema: any;
    onSubmit: (values: any, actions: any) => void;
    isSubmitting: boolean;
    isCreate?: boolean;
}

export default function UserForm({
    initialValues,
    validationSchema,
    onSubmit,
    isSubmitting,
    isCreate,
}: UserFormProps) {
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
                                htmlFor="name"
                                className="block text-sm font-medium text-indigo-400"
                            >
                                Name
                            </label>
                            <Field
                                id="name"
                                name="name"
                                type="text"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-custom"
                            />
                            <ErrorMessage
                                name="name"
                                component="p"
                                className="text-red-400 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-indigo-400"
                            >
                                Email
                            </label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-custom"
                            />
                            <ErrorMessage
                                name="email"
                                component="p"
                                className="text-red-400 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-indigo-400"
                            >
                                Password
                            </label>
                            <Field
                                id="password"
                                name="password"
                                type="password"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-custom"
                            />
                            <ErrorMessage
                                name="password"
                                component="p"
                                className="text-red-400 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-indigo-400"
                            >
                                Role
                            </label>
                            <Field
                                as="select"
                                id="role"
                                name="role"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-custom"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Field>
                            <ErrorMessage
                                name="role"
                                component="p"
                                className="text-red-400 text-sm mt-1"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`mx-auto w-[50%] p-2 ${
                            isCreate ? "bg-teal-400" : "bg-indigo-400"
                        } text-white rounded-md hover:bg-opacity-90 disabled:opacity-50`}
                    >
                        {isSubmitting
                            ? isCreate
                                ? "Creating..."
                                : "Updating..."
                            : isCreate
                            ? "Create User"
                            : "Update"}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
