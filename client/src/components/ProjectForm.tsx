"use client";

import { Project } from "@/types/Project.type";
import { User } from "@/types/User.type";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/Button";

interface ProjectFormProps {
    initialValues: Pick<Project, "name" | "description" | "members">;
    validationSchema: any;
    onSubmit: (values: any, actions: any) => void;
    isSubmitting: boolean;
    isCreate?: boolean;
    users: Pick<User, "name" | "Id">[];
}

export default function ProjectForm({
    initialValues,
    validationSchema,
    onSubmit,
    isSubmitting,
    isCreate,
    users = [],
}: ProjectFormProps) {
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
                                Project Name
                            </label>
                            <Field
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Project name"
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
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Description
                            </label>
                            <Field
                                as="textarea"
                                id="description"
                                name="description"
                                placeholder="Project description"
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                            />
                            <ErrorMessage
                                name="description"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>

                        {isCreate && (
                            <div>
                                <label
                                    htmlFor="members"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Team Members
                                </label>
                                <Field
                                    as="select"
                                    id="members"
                                    name="members"
                                    multiple
                                    className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                                >
                                    {users.map((user) => (
                                        <option key={user.Id} value={user.Id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="members"
                                    component="p"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            {isCreate ? "Create Project" : "Update Project"}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}