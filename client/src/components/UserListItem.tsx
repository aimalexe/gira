"use client";

import { User } from "@/types/User.type";
import UserForm from "./UserForm";
import { FormikHelpers } from "formik";
import { UpdateUserSchema } from "@/validators/user.validator";

interface UserListItemProps {
    user: User;
    editingUserId: string | null;
    setEditingUserId: (id: string | null) => void;
    handleUpdateUser: (values: any, actions: FormikHelpers<any>) => void;
    handleDeleteUser: (userId: string) => void;
}

export default function UserListItem({
    user,
    editingUserId,
    setEditingUserId,
    handleUpdateUser,
    handleDeleteUser,
}: UserListItemProps) {
    const isEditing = editingUserId === user.Id;

    return (
        <div className="p-4 border rounded-md bg-gray-soft">
            {isEditing ? (
                <UserForm
                    initialValues={{
                        name: user?.name ?? "",
                        email: user?.email ?? "",
                        password: "",
                        role: user?.role,
                    }}
                    validationSchema={UpdateUserSchema}
                    onSubmit={handleUpdateUser}
                    isSubmitting={false}
                    isCreate={false}
                />
            ) : (
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-medium text-indigo-custom">
                            {user.name}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-600">Role: {user.role}</p>
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => setEditingUserId(user.Id)}
                            className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteUser(user.Id)}
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
