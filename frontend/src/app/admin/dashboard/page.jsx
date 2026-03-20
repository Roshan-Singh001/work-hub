"use client"
import { useAuth } from "@/contexts/AuthContext"

export default function AdminDashboard() {
    const { userData } = useAuth();

    console.log("User Data: ", userData);

    return (
        <>
            <h1>Admin Dashboard</h1>
        </>
    )
}