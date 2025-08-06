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
            <p>Loading...</p>
        </div>
    );
}