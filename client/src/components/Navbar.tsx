"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";

export const Navbar = () => {
    const { user, logout } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Logo />
                    <DesktopMenu user={user} logout={logout} />
                    <MobileMenuButton
                        isOpen={isMobileMenuOpen}
                        toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                </div>
            </div>
            <MobileMenu
                isOpen={isMobileMenuOpen}
                user={user}
                logout={logout}
                closeMenu={() => setIsMobileMenuOpen(false)}
            />
        </nav>
    );
};

const Logo = () => (
    <div className="flex-shrink-0">
        <Link
            href="/"
            className="text-xl font-bold text-gray-800 tracking-wider hover:text-gray-600 transition-colors duration-300"
        >
            Gira
        </Link>
    </div>
);

const DesktopMenu = ({
    user,
    logout,
}: {
    user: any;
    logout: () => Promise<void>;
}) => (
    <div className="hidden md:block">
        <div className="ml-10 flex items-center space-x-4">
            {user ? (
                <AuthenticatedDesktopMenu user={user} logout={logout} />
            ) : (
                <LoginButton />
            )}
        </div>
    </div>
);

const AuthenticatedDesktopMenu = ({
    user,
    logout,
}: {
    user: any;
    logout: () => Promise<void>;
}) => (
    <>
        {/* Admin Links */}
        {user.role === "admin" && (
            <>
                <NavLink href="/user">Users</NavLink>
                <NavLink href="/project">Projects</NavLink>
            </>
        )}

        {/* Regular User Links */}
        {user.role !== "admin" && <NavLink href="/project">Projects</NavLink>}

        {/* User Greeting */}
        <span className="text-sm text-gray-600 px-3 py-2">
            Hello, <span className="font-medium text-gray-800">{user.role}</span>
        </span>

        {/* Logout Button */}
        <button
            onClick={logout}
            className="px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:text-white hover:bg-red-500/90 border border-red-500/50 transition-all duration-300"
        >
            Logout
        </button>
    </>
);

const NavLink = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => (
    <Link
        href={href}
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-300"
    >
        {children}
    </Link>
);

const LoginButton = () => (
    <Link
        href="/login"
        className="px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
    >
        Login
    </Link>
);

const MobileMenuButton = ({
    isOpen,
    toggle,
}: {
    isOpen: boolean;
    toggle: () => void;
}) => (
    <div className="md:hidden">
        <button
            onClick={toggle}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-all duration-300"
            aria-expanded="false"
        >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
                <svg
                    className="block h-6 w-6"
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
            ) : (
                <svg
                    className="block h-6 w-6"
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
            )}
        </button>
    </div>
);

const MobileMenu = ({
    isOpen,
    user,
    logout,
    closeMenu,
}: {
    isOpen: boolean;
    user: any;
    logout: () => Promise<void>;
    closeMenu: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="md:hidden animate-fade-in bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {user ? (
                    <AuthenticatedMobileMenu
                        user={user}
                        logout={logout}
                        closeMenu={closeMenu}
                    />
                ) : (
                    <MobileLoginButton closeMenu={closeMenu} />
                )}
            </div>
        </div>
    );
};

const AuthenticatedMobileMenu = ({
    user,
    logout,
    closeMenu,
}: {
    user: any;
    logout: () => Promise<void>;
    closeMenu: () => void;
}) => (
    <>
        {/* Admin Links */}
        {user.role === "admin" && (
            <>
                <MobileNavLink href="/user" onClick={closeMenu}>
                    Users
                </MobileNavLink>
                <MobileNavLink href="/project" onClick={closeMenu}>
                    Projects
                </MobileNavLink>
            </>
        )}

        {/* Regular User Links */}
        {user.role !== "admin" && (
            <MobileNavLink href="/project" onClick={closeMenu}>
                Projects
            </MobileNavLink>
        )}

        {/* Logout Button */}
        <button
            onClick={async () => {
                await logout();
                closeMenu();
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500/10 border border-red-500/30 transition-all duration-300"
        >
            Logout
        </button>
    </>
);

const MobileNavLink = ({
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
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-300"
        onClick={onClick}
    >
        {children}
    </Link>
);

const MobileLoginButton = ({ closeMenu }: { closeMenu: () => void }) => (
    <Link
        href="/login"
        className="block px-3 py-2 rounded-md text-base font-medium bg-gray-900 text-white text-center hover:bg-gray-800 transition-all duration-300 shadow-sm"
        onClick={closeMenu}
    >
        Login
    </Link>
);