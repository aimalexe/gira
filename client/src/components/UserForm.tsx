"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/Button";
import api from "@/lib/api";
import { Role } from "@/types/Role.type";

interface UserFormProps {
    initialValues: {
        name: string;
        email: string;
        password: string;
        role?: string;
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
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await api.get("/role");
                const rolesData = res.data?.roles || [];

                setRoles(
                    rolesData
                        .map(
                            (r: any): Role => ({
                                Id: r.Id,
                                name: r.name,
                            })
                        )
                        .filter((r: Role) => r.name.toLowerCase() !== "admin")
                );
            } catch (err) {
                console.error("Failed to fetch roles:", err);
            }
        };
        fetchRoles();
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {() => (
                <Form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Name */}
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

                        {/* Email */}
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

                        {/* Password */}
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

                        {/* Role */}
                        <div>
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
                                <option value="">Select role</option>
                                {roles.map((role) => (
                                    <option key={role.Id} value={role.Id}>
                                        {role.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage
                                name="role"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            variant="primary"
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
