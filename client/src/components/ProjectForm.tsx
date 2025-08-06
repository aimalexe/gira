"use client";

import { Project } from "@/types/Project.type";
import { UserWithUnderscoreId } from "@/types/User.type";
import { Formik, Form, Field, ErrorMessage } from "formik";

interface ProjectFormProps {
    initialValues: Pick<Project, "name" | "description" | "members">;
    validationSchema: any;
    onSubmit: (values: any, actions: any) => void;
    isSubmitting: boolean;
    isCreate?: boolean;
    users: Pick<UserWithUnderscoreId, "name" | "_id">[];
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-indigo-800"
                            >
                                Name
                            </label>
                            <Field
                                id="name"
                                name="name"
                                type="text"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                            />
                            <ErrorMessage
                                name="name"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>
                        {isCreate && (
                            <div className="col-span-1">
                                <label
                                    htmlFor="members"
                                    className="block text-sm font-medium text-indigo-800"
                                >
                                    Members
                                </label>
                                <Field
                                    as="select"
                                    id="members"
                                    name="members"
                                    multiple
                                    className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-teal-500"
                                >
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="members"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                        )}
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
                            ? "Create Project"
                            : "Update"}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
