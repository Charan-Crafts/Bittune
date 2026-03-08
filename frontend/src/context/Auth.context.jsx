import React, { createContext, useContext  , useState, useEffect } from "react"
import { getProfile } from "../services/authService"



const AuthContext = createContext();

export const AuthProvider = ({children})=>{

    const [user,setUser]= useState(null)

    const [token,setToken] = useState(localStorage.getItem("token") || null)

    const [isAuthenticated,setIsAuthenticated] = useState(!!token)

    const [role,setRole] = useState(null);

    const [loading,setLoading] = useState(!!token);

    useEffect(()=>{
        if(token){
            getProfile().then((res)=>{
                setUser(res.data.data);
                setRole(res.data.data.role);
                setIsAuthenticated(true);
            }).catch(()=>{
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
                setRole(null);
                setIsAuthenticated(false);
            }).finally(()=>{
                setLoading(false);
            })
        }
    },[])

    const login = (userData , token )=>{

        setRole(userData.role)

        setUser(userData);

        setToken(token)

        setIsAuthenticated(true)
    }

    const logout = ()=>{

        localStorage.removeItem("token")

        setIsAuthenticated(false)

        setRole(null)

        setUser(null);

        setToken(null)
    }



    return (
        <AuthContext.Provider value={{
            user,token,login,logout,role,isAuthenticated,loading
        }}>

            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext);
}