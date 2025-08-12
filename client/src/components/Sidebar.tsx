import Link from "next/link";
import React, { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { ConfirmModal } from "./ConfirmModal";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuthStore();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    const handleLogout = () => {
        setConfirmOpen(true);
    };

    const performLogout = async () => {
        await logout();
        closeSidebar();
    };

    return (
        <>
            {/* Burger Menu and Logo (Always Visible) */}
            <div
                className={`fixed left-3 z-50 flex items-center space-x-4 ${
                    isOpen
                        ? "top-6"
                        : "bg-white/10 backdrop-blur-md rounded-lg p-1 shadow-lg top-2"
                } transition-all duration-300`}
            >
                {!isOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white/20 focus:outline-none transition-all duration-300"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Toggle sidebar</span>

                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                )}
                <div className="flex-shrink-0">
                    <Link
                        href="/"
                        className="text-xl font-michroma font-bold text-gray-800 tracking-wider hover:text-gray-600 transition-colors duration-300"
                    >
                        Gira
                    </Link>
                </div>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-md border-r border-gray-200/80 shadow-sm z-40 transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={closeSidebar}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-all duration-300"
                            aria-label="Close sidebar"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Greeting */}
                    {user && (
                        <div className="mt-10 mb-8">
                            <span className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Hello,{" "}
                                {user.role.name.charAt(0).toUpperCase() +
                                    user.role.name.slice(1)}
                            </span>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="flex-1 space-y-3">
                        {user ? (
                            <>
                                {user.role.name === "admin" && (
                                    <>
                                        <NavLink
                                            href="/user"
                                            onClick={closeSidebar}
                                        >
                                            Users
                                        </NavLink>
                                        <NavLink
                                            href="/project"
                                            onClick={closeSidebar}
                                        >
                                            Projects
                                        </NavLink>
                                        <NavLink
                                            href="/role"
                                            onClick={closeSidebar}
                                        >
                                            Roles
                                        </NavLink>
                                    </>
                                )}
                                {user.role.name !== "admin" && (
                                    <NavLink
                                        href="/project"
                                        onClick={closeSidebar}
                                    >
                                        Projects
                                    </NavLink>
                                )}
                            </>
                        ) : (
                            <NavLink href="/login" onClick={closeSidebar}>
                                Login
                            </NavLink>
                        )}
                    </div>

                    {/* Logout/Login Button */}
                    <div className="mt-auto">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-center px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:text-white hover:bg-red-500/90 border border-red-500/50 transition-all duration-300"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-3 py-2 rounded-md text-sm font-medium bg-gray-900 text-white text-center hover:bg-gray-800 transition-all duration-300 shadow-sm"
                                onClick={closeSidebar}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={closeSidebar}
                ></div>
            )}
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={performLogout}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
                confirmVariant="danger"
            />
        </>
    );
};

const NavLink = ({
    href,
    onClick,
    children,
}: {
    href: string;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <Link
        href={href}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200/50 transition-all duration-300 border-l-4 border-transparent hover:border-gray-400"
        onClick={onClick}
    >
        {children}
    </Link>
);
