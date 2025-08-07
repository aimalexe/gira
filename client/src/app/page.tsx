"use client"

import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            router.push("/project");
        } else {
            router.push("/login");
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}