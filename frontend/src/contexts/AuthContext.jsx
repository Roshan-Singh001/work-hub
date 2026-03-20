"use client"
import { useState, createContext, useContext, useEffect } from "react"

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
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
    }, [])
    

    return (
        <AuthContext.Provider value={{userData, setUserData}}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);