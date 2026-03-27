"use client"
import { useState, createContext, useContext, useEffect } from "react"
import { useRouter, usePathname  } from "next/navigation"
import { toast } from "sonner"

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const router = useRouter();
    const pathname = usePathname();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

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
    }, [pathname]);

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
        <AuthContext.Provider value={{userData, setUserData, loading, logOut}}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);