"use client";

import { Project } from "@/types/Project.type";
import { User } from "@/types/User.type";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
    ChevronDownIcon,
    UserPlusIcon,
    UserMinusIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid";
import Avatar from "@/components/Avatar";

interface ProjectCardProps {
    project: Project;
    onEdit: () => void;
    onDelete: () => void;
    onAddMember: (memberId: string) => void;
    onRemoveMember: (memberId: string) => void;
    users: { Id: string; name: string }[];
    currentUser: User;
}

export default function ProjectCard({
    project,
    onEdit,
    onDelete,
    onAddMember,
    onRemoveMember,
    users,
    currentUser,
}: ProjectCardProps) {
    const params = new URLSearchParams({
        projectId: project.Id,
        members: JSON.stringify(
            project.members?.map(({ Id, name }) => ({ Id, name })) || []
        ),
    });

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex-col p-3 md:p-6">
                <div className="flex justify-between items-start">
                    <Link
                        href={`/project/task?${params.toString()}`}
                        className="flex items-center justify-center gap-2 group"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {project.name}
                        </h3>
                        <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-800 group-hover:text-blue-600 transition-colors" />
                    </Link>

                    {currentUser.role === "admin" && (
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button className="inline-flex justify-center w-8 h-8 rounded-full items-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
                                    <span className="sr-only">
                                        Open options
                                    </span>
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
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={onEdit}
                                                    className={`${
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700"
                                                    } block w-full px-4 py-2 text-left text-sm`}
                                                >
                                                    Edit Project
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
                                                    } block w-full px-4 py-2 text-left text-sm`}
                                                >
                                                    Delete Project
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    )}
                </div>

                {project.description && (
                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                        {project.description}
                    </p>
                )}

                {project.members && project.members.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Team Members
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {project.members?.map((member) => (
                                <div
                                    key={member.Id}
                                    className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full"
                                >
                                    <Avatar name={member.name} size="sm" />
                                    <span className="text-sm text-gray-700">
                                        {member.name}
                                    </span>
                                    {currentUser.role === "admin" && (
                                        <button
                                            onClick={() =>
                                                onRemoveMember(member.Id)
                                            }
                                            className="text-gray-400 hover:text-red-500"
                                            title="Remove member"
                                        >
                                            <UserMinusIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentUser.role === "admin" && (
                    <div className="self-baseline mt-4 pt-4 border-t border-gray-100">
                        <Menu as="div" className="relative">
                            <Menu.Button className="inline-flex w-full justify-center rounded-md bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-blue-100">
                                <UserPlusIcon className="h-4 w-4 mr-2" />
                                Add Team Member
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 bottom-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                                    <div className="py-1">
                                        {users
                                            .filter(
                                                (user) =>
                                                    !project.members?.some(
                                                        (m) => m.Id === user.Id
                                                    )
                                            )
                                            .map((user) => (
                                                <Menu.Item key={user.Id}>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() =>
                                                                onAddMember(
                                                                    user.Id
                                                                )
                                                            }
                                                            className={`${
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700"
                                                            } block w-full px-4 py-2 text-left text-sm`}
                                                        >
                                                            {user.name}
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        {users.filter(
                                            (user) =>
                                                !project.members?.some(
                                                    (m) => m.Id === user.Id
                                                )
                                        ).length === 0 && (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                No available users to add
                                            </div>
                                        )}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                )}
            </div>
        </div>
    );
}
