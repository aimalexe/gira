"use client";

import "@/styles/global.css";
import { useAuthStore } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth >= 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <html lang="en">
            <head>
                <title>Gira: Manage your projects</title>
            </head>
            <body className="bg-gray-50 max-w-full md:max-w-6xl">
                {user && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
                <main
                    className={`min-h-screen pt-16 md:pt-0 ${
                        isOpen ? "md:ml-64" : "md:ml-20 md:mt-6"
                    } mx-auto transition-all duration-300 ease-in-out`}
                >
                    <div>{children}</div>
                </main>
            </body>
        </html>
    );
}
