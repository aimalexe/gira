"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/Button";
import { groupPermissions } from "@/utils/permissions.util";
import { Permission } from "@/types/Permission.type";

interface RoleFormProps {
    role?: {
        Id?: string;
        name: string;
        description?: string;
        permissions: Permission[];
    };
    permissions: Permission[];
    onSubmit: (data: {
        name: string;
        description: string;
        permissions: string[];
    }) => void;
}

export default function RoleForm({
    role,
    permissions,
    onSubmit,
}: RoleFormProps) {
    const groupedPermissions = groupPermissions(permissions);
    const formik = useFormik({
        initialValues: {
            name: role?.name || "",
            description: role?.description || "",
            permissions: role?.permissions?.map((p: Permission) => p.Id) || [],
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Role name is required")
                .min(3, "Role name must be at least 3 characters"),
            description: Yup.string().max(255).required(),
            permissions: Yup.array().of(Yup.string()).min(1, "At least one permission should be granted "),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    useEffect(() => {
        if (role?.permissions) {
            formik.setFieldValue(
                "permissions",
                role.permissions.map((p: Permission) => p.Id)
            );
        }
    }, [role]);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">
                    Role Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md ${
                        formik.touched.name && formik.errors.name
                            ? "border-red-500"
                            : ""
                    }`}
                />
                {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                        {formik.errors.name}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Description
                </label>
                <input
                    type="text"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md ${
                        formik.touched.description && formik.errors.description
                            ? "border-red-500"
                            : ""
                    }`}
                />
                {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                        {formik.errors.description}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Assign Permissions
                </label>
                <div className="space-y-4 overflow-y-auto max-h-60 p-2 border rounded grid grid-cols-2 md:grid-cols-3">
                    {Object.keys(groupedPermissions).map((module) => (
                        <div key={module}>
                            <p className="font-semibold text-sm mb-1 capitalize">
                                {module}
                            </p>
                            <div className="space-y-1 pl-4">
                                {groupedPermissions[module].map((perm) => (
                                    <label
                                        key={perm.Id}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            name="permissions"
                                            value={perm.Id}
                                            checked={formik.values.permissions.includes(
                                                perm.Id
                                            )}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue(
                                                        "permissions",
                                                        [
                                                            ...formik.values
                                                                .permissions,
                                                            perm.Id,
                                                        ]
                                                    );
                                                } else {
                                                    formik.setFieldValue(
                                                        "permissions",
                                                        formik.values.permissions.filter(
                                                            (p) => p !== perm.Id
                                                        )
                                                    );
                                                }
                                            }}
                                            onBlur={() =>
                                                formik.setFieldTouched(
                                                    "permissions",
                                                    true
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm">
                                            {perm.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {formik.touched.permissions && formik.errors.permissions && (
                    <p className="text-red-500 text-sm mt-1">
                        {formik.errors.permissions as string}
                    </p>
                )}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? "Saving..." : "Save Role"}
                </Button>
            </div>
        </form>
    );
}
