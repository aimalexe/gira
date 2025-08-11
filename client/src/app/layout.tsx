"use client";

import "@/styles/global.css";
import { useAuthStore } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthStore();

    return (
        <html lang="en">
            <head>
                <title>Gira: Manage your projects</title>
            </head>
            <body className="bg-gray-50">
                {user && <Navbar />}
                <main className="min-h-screen">
                    <div className="max-w-full md:max-w-7xl mx-auto">{children}</div>
                </main>
            </body>
        </html>
    );
}
