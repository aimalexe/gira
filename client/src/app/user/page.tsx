"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormikHelpers } from "formik";
import { useAuthStore } from "@/lib/auth";
import api from "@/lib/api";
import UserForm from "@/components/UserForm";
import Pagination from "@/components/Pagination";
import {
    CreateUserSchema,
    UpdateUserSchema,
} from "@/validators/user.validator";
import { User } from "@/types/User.type";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Table, TableRow, TableCell } from "@/components/Table";
import {
    PencilSquareIcon,
    TrashIcon,
    UserPlusIcon,
} from "@heroicons/react/20/solid";
import { ConfirmModal } from "@/components/ConfirmModal";

export default function UsersPage() {
    const { user: currentUser } = useAuthStore();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        pageNo: 1,
        limit: 10,
        itemsPerPage: 10,
    });
    const [error, setError] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmVariant, setConfirmVariant] = useState<
        "primary" | "secondary" | "danger" | "success" | "ghost"
    >("primary");

    useEffect(() => {
        if (currentUser?.role.name === "admin") {
            fetchUsers();
        } else if (!currentUser) {
            router.push("/login");
        } else {
            router.push("/");
        }
    }, [currentUser, pagination.pageNo, router]);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/user", {
                params: { page: pagination.pageNo, limit: pagination.limit },
            });
            setUsers(response.data.users);
            setPagination(response.data.pagination);
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch users");
        }
    };

    const handleCreateUser = async (
        values: {
            name: string;
            email: string;
            password: string;
            role: "admin" | "user";
        },
        { setSubmitting, resetForm }: FormikHelpers<any>
    ) => {
        try {
            await api.post("/user", values);
            resetForm();
            fetchUsers();
            setError("");
            setIsCreateModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create user");
            setSubmitting(false);
        }
    };

    const handleUpdateUser = async (
        userId: string,
        values: {
            name?: string;
            email?: string;
            password?: string;
        },
        { setSubmitting }: FormikHelpers<any>
    ) => {
        try {
            if (values.password === "") delete values.password;
            await api.put(`/user/${userId}`, values);
            fetchUsers();
            setError("");
            setEditingUser(null);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update user");
            setSubmitting(false);
        }
    };

    /* const handleDeleteUser = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/user/${userId}`);
                fetchUsers();
            } catch (err: any) {
                setError(
                    err.response?.data?.message || "Failed to delete user"
                );
            }
        }
    }; */
    const handleDeleteUser = async (userId: string) => {
        setConfirmTitle("Delete User");
        setConfirmMessage("Are you sure you want to delete this user?");
        setConfirmVariant("danger");
        setConfirmAction(() => async () => {
            try {
                await api.delete(`/user/${userId}`);
                fetchUsers();
            } catch (err: any) {
                setError(
                    err.response?.data?.message || "Failed to delete user"
                );
            }
        });
        setConfirmOpen(true);
    };

    if (!currentUser || currentUser.role.name !== "admin") {
        return null;
    }

    return (
        <div className="w-full md:max-w-6xl mx-auto p-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden p-6">
                <div className="flex justify-between items-center mb-8 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-800">
                        User Management
                    </h1>
                    <Button
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <UserPlusIcon className="h-5 w-5 text-white" /> Create
                        New User
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                <Table headers={["Name", "Email", "Role", "Actions"]}>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user.Id}>
                                <TableCell>
                                    <div className="flex items-center">
                                        {user.name}
                                        {user.role.name === "admin" && (
                                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="capitalize">
                                    {user.role.name}
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="primary"
                                            onClick={() => setEditingUser(user)}
                                        >
                                            <PencilSquareIcon className="h-5 w-5 text-white" />{" "}
                                            Edit
                                        </Button>
                                        {user.role.name !== "admin" && (
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    handleDeleteUser(user.Id)
                                                }
                                            >
                                                <TrashIcon className="h-5 w-5 text-white" />{" "}
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center py-8 text-gray-500"
                            >
                                No users found
                            </TableCell>
                        </TableRow>
                    )}
                </Table>

                <div className="mt-6">
                    <Pagination
                        pagination={pagination}
                        setPagination={setPagination}
                    />
                </div>
            </div>

            {/* Create User Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New User"
            >
                <UserForm
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        role: {
                            name: "user",
                        },
                    }}
                    validationSchema={CreateUserSchema}
                    onSubmit={handleCreateUser}
                    isSubmitting={false}
                    isCreate={true}
                />
            </Modal>

            {/* Edit User Modal */}
            {editingUser && (
                <Modal
                    isOpen={!!editingUser}
                    onClose={() => setEditingUser(null)}
                    title={`Edit User: ${editingUser.name}`}
                >
                    <UserForm
                        initialValues={{
                            name: editingUser?.name ?? "",
                            email: editingUser?.email ?? "",
                            password: "",
                            role: {
                                name: editingUser.role.name,
                            },
                        }}
                        validationSchema={UpdateUserSchema}
                        onSubmit={(values, actions) => {
                            delete values.role;
                            handleUpdateUser(editingUser.Id, values, actions);
                        }}
                        isSubmitting={false}
                        isCreate={false}
                    />
                </Modal>
            )}
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmAction}
                title={confirmTitle}
                message={confirmMessage}
                confirmVariant={confirmVariant}
            />
        </div>
    );
}
