"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/Button";

interface UserFormProps {
    initialValues: {
        name: string;
        email: string;
        password: string;
        role: {
            name: string
        };
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
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Name
                            </label>
                            <Field
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Name"
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                            />
                            <ErrorMessage
                                name="name"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                            />
                            <ErrorMessage
                                name="email"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <Field
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                            />
                            <ErrorMessage
                                name="password"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                            {!isCreate && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave blank to keep current password
                                </p>
                            )}
                        </div>
                        {isCreate && (<div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Role
                            </label>
                            <Field
                                as="select"
                                id="role"
                                name="role"
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Field>
                            <ErrorMessage
                                name="role"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>)}
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            variant={isCreate ? "primary" : "primary"}
                            isLoading={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            {isCreate ? "Create User" : "Update User"}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
