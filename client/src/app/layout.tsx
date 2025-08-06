"use client";

import "@/styles/global.css";
import { useAuthStore } from '@/lib/auth';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore();

    return (
        <html lang="en">
            <body className="bg-gray-100">
                <nav className="bg-indigo-500 text-white p-4">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <Link href="/" className="text-lg font-bold font-michroma">Gira</Link>
                        <div className="space-x-4">
                            {user ? (
                                <>
                                    {user.role === 'admin' ? (
                                        <>
                                            <Link href="/user" className="p-2 hover:bg-indigo-700 rounded">
                                                Users
                                            </Link>
                                            <Link href="/project" className="p-2 hover:bg-indigo-700 rounded">
                                                Projects
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/project" className="p-2 hover:bg-indigo-700 rounded">
                                                Projects
                                            </Link>
                                            {/* <Link href="/tasks" className="p-2 hover:bg-indigo-700 rounded">
                                                Tasks
                                            </Link> */}
                                        </>
                                    )}
                                    <span className="text-sm">Hello, {user.role}</span>
                                    <button
                                        onClick={async () => {
                                            await logout();
                                        }}
                                        className="p-2 border border-red-300 text-red-300 rounded hover:bg-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" className="p-2 bg-teal-500 rounded hover:bg-indigo-700">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
                <main className="min-h-screen">{children}</main>
            </body>
        </html>
    );
}