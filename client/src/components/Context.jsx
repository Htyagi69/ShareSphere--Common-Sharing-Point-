import React, { useEffect,useState } from 'react'
import { createContext } from 'react'
import { toast } from 'sonner'

export const AuthProvider=createContext()

function AuthContext({children}) {
    const [theme,setTheme]=useState(false)
    const [userName,setUsername]=useState('')
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [loading,setLoading]=useState(true);
    const verifyURI=`${import.meta.env.VITE_API_BASE_URL}/auth/verify`
    useEffect(()=>{
        async function checkAuth(retries=3){
        try{
            const result=await fetch(verifyURI,{
                method:'GET',
                credentials:'include'
            });
            const  response= await result.json();
            console.log("res",response);
            if(response.authenticated) {
                setIsAuthenticated(true);
                setUsername(response.user.name)
            }
            else{
                if (retries > 0) {
                    setTimeout(() => checkAuth(retries - 1), 1000); // retry after 1s
                    return;
                }
                setIsAuthenticated(false);
                localStorage.removeItem("token");
                return <div>Please Signup</div>
                }
            }catch(err){
                setIsAuthenticated(false);
            }finally{
                setLoading(false)
                // console.log('final',isAuthenticated);
            }
        }
        console.log('start',isAuthenticated);
        checkAuth()
    },[])
    const logoutURI=`${import.meta.env.VITE_API_BASE_URL}/auth/logout`
    async function handlelogout(){
        try{
        const res=await fetch(logoutURI,{
            method:'POST',
            credentials:'include',
        });
        setIsAuthenticated(false);
        const response =res.json();
        console.log(response.message);
        localStorage.removeItem('token');
        toast.success("Logout Successfully",{ position: "bottom-right" })
    }catch (err) {
            console.error("Logout failed", err);
    }
}
    return (
        <AuthProvider.Provider value={{isAuthenticated,loading,setIsAuthenticated,handlelogout,theme,setTheme,userName,setUsername}}>
            {children}
        </AuthProvider.Provider>
    )
}

export default AuthContext
