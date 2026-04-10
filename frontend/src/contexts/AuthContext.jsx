"use client"
import { useState, createContext, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshAuth, setRefreshAuth] = useState(0);

    useEffect(() => {
      const checkAuth = async ()=>{
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                method: "GET",
                credentials: "include",
            })

            const data = await res.json();
            setUserData(data.user);
            
        } catch (error) {
            console.error("Error verifying auth:", error);
            
            setUserData(null);
        }
        finally{
            setLoading(false);
        }
      }
      checkAuth();
    }, [refreshAuth]);

    function refreshUser(){
        setRefreshAuth(prev => prev + 1)
    }

    async function logOut(){
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            })
            setUserData(null);
            router.push("/auth/login");
            toast.success("Logged out Successfully");
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error("Error logging out");
        }
    }
    

    return (
        <AuthContext.Provider value={{userData, setUserData, loading, logOut, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);