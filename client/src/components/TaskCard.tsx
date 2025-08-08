"use client";

import { Task } from "@/types/Task.type";
import { User } from "@/types/User.type";
import { Button } from "@/components/Button";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
    ChevronDownIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import Avatar from "@/components/Avatar";
import { statusColors } from "@/constants/statusColors.const";

interface TaskCardProps {
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
    members: Pick<User, "Id" | "name">[];
}

export default function TaskCard({
    task,
    onEdit,
    onDelete,
    members,
}: TaskCardProps) {
    const assignedUser = members.find((m) => m.Id === task.assignedTo?.Id);
    const statusColor =
        statusColors[task.status] || "bg-gray-200 text-gray-800";

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {task.title}
                        </h3>

                        {task.description && (
                            <p className="mt-2 text-gray-600 text-sm">
                                {task.description}
                            </p>
                        )}

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${statusColor}`}
                                >
                                    {task.status}
                                </span>
                            </div>

                            <div className="flex items-center">
                                {assignedUser ? (
                                    <div className="flex items-center">
                                        <Avatar
                                            name={assignedUser.name ?? "GU"}
                                            size="sm"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            {assignedUser.name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500">
                                        Unassigned
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center">
                                <span className="text-sm text-gray-700">
                                    Due:{" "}
                                    {new Date(
                                        task.dueDate
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {task.fileAttachment && (
                            <div className="mt-3">
                                <a
                                    href={`http://localhost:5000/${task.fileAttachment?.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    View Attachment
                                </a>
                            </div>
                        )}
                    </div>

                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="inline-flex justify-center w-8 h-8 rounded-full items-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
                                <span className="sr-only">Open options</span>
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute top-[-5] right-[25] z-10 mt-2 w-40 md:w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={onEdit}
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700"
                                                } flex items-center w-full px-4 py-2 text-sm`}
                                            >
                                                <PencilIcon className="h-4 w-4 mr-2" />
                                                Edit Task
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={onDelete}
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-red-600"
                                                        : "text-red-600"
                                                } flex items-center w-full px-4 py-2 text-sm`}
                                            >
                                                <TrashIcon className="h-4 w-4 mr-2" />
                                                Delete Task
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </div>
    );
}
