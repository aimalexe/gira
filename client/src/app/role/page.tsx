"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Table, TableRow, TableCell } from "@/components/Table";
import {
    PencilSquareIcon,
    TrashIcon,
    PlusIcon,
} from "@heroicons/react/20/solid";
import api from "@/lib/api";
import { ConfirmModal } from "@/components/ConfirmModal";
import RoleForm from "@/components/RoleForm";
import { Permission } from "@/types/Permission.type";
import { checkPermission } from "@/utils/permissions.util";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import PermissionGuard from "@/components/PermissionGuard";
import { User } from "@/types/User.type";

export default function RolesPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [roles, setRoles] = useState<any[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<any | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");

    useEffect(() => {
        if (user) {
            fetchRoles();
            fetchPermissions();
        } else {
            router.push("/login");
        }
    }, [user, router]);

    const fetchRoles = async () => {
        if (!checkPermission(user, "view:role")) return;
        try {
            const res = await api.get("/role");
            setRoles(res.data.roles);
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch roles");
        }
    };

    const fetchPermissions = async () => {
        try {
            const res = await api.get("/permission");
            const permissionsData = res.data?.permissions || [];
            setPermissions(
                permissionsData.map(
                    (p: any): Permission => ({
                        Id: p.Id,
                        name: p.name,
                    })
                )
            );
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to fetch permissions"
            );
        }
    };

    const openCreateModal = async () => {
        await fetchPermissions();
        setIsModalOpen(true);
    };

    const openEditModal = async (role: any) => {
        await fetchPermissions();
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const handleCreateRole = async (values: any) => {
        if (!checkPermission(user, "create:role")) return;
        try {
            await api.post("/role", values);
            setIsModalOpen(false);
            fetchRoles();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create role");
        }
    };

    const handleUpdateRole = async (values: any) => {
        if (!checkPermission(user, "update:role")) return;
        try {
            await api.put(`/role/${editingRole.Id}`, values);
            setIsModalOpen(false);
            setEditingRole(null);
            fetchRoles();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update role");
        }
    };

    const handleDeleteRole = (roleId: string) => {
        if (!checkPermission(user, "delete:role")) return;
        setConfirmTitle("Delete Role");
        setConfirmMessage("Are you sure you want to delete this role?");
        setConfirmAction(() => async () => {
            try {
                await api.delete(`/role/${roleId}`);
                fetchRoles();
            } catch (err: any) {
                setError(
                    err.response?.data?.message || "Failed to delete role"
                );
            }
            setConfirmOpen(false);
        });
        setConfirmOpen(true);
    };

    return (
        <div className="w-full md:max-w-6xl mx-auto p-3">
            <div className="bg-white/80 rounded-xl p-6">
                <div className="flex justify-between items-center flex-wrap mb-8">
                    <h1 className="text-2xl font-bold">Role Management</h1>
                    <PermissionGuard
                        user={user as User}
                        permission="create:role"
                    >
                        <Button onClick={openCreateModal}>
                            <PlusIcon className="h-5 w-5 text-white" /> New Role
                        </Button>
                    </PermissionGuard>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                <PermissionGuard user={user as User} permission="view:role">
                    <Table headers={["Name", "Permissions", "Actions"]}>
                        {roles.length > 0 ? (
                            roles.map((role) => (
                                <TableRow key={role.Id}>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell>
                                        {role.permissions
                                            ?.slice(0, 3)
                                            .map((p: any) => (
                                                <span
                                                    key={p.Id}
                                                    className="mr-2 px-2 py-1 bg-gray-200 rounded-full text-xs"
                                                >
                                                    {p.name}
                                                </span>
                                            ))}
                                        {role.permissions?.length > 3 && (
                                            <span className="text-gray-500 text-xs">
                                                +{role.permissions.length - 3}{" "}
                                                more
                                            </span>
                                        )}
                                    </TableCell>

                                    {role.name !== "admin" && (
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <PermissionGuard
                                                    user={user as User}
                                                    permission="update:role"
                                                >
                                                    <Button
                                                        onClick={() =>
                                                            openEditModal(role)
                                                        }
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5 text-white" />{" "}
                                                        Edit
                                                    </Button>
                                                </PermissionGuard>
                                                <PermissionGuard
                                                    user={user as User}
                                                    permission="delete:role"
                                                >
                                                    <Button
                                                        variant="danger"
                                                        onClick={() =>
                                                            handleDeleteRole(
                                                                role.Id
                                                            )
                                                        }
                                                    >
                                                        <TrashIcon className="h-5 w-5 text-white" />{" "}
                                                        Delete
                                                    </Button>
                                                </PermissionGuard>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center text-gray-500"
                                >
                                    No roles found
                                </TableCell>
                            </TableRow>
                        )}
                    </Table>
                </PermissionGuard>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingRole(null);
                }}
                title={
                    editingRole
                        ? `Edit Role: ${editingRole.name}`
                        : "Create New Role"
                }
            >
                <RoleForm
                    role={editingRole}
                    permissions={permissions}
                    onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
                />
            </Modal>

            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmAction}
                title={confirmTitle}
                message={confirmMessage}
                confirmVariant="danger"
            />
        </div>
    );
}
