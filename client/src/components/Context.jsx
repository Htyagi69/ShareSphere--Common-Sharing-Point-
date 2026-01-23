import React, { useEffect,useState } from 'react'
import { createContext } from 'react'
import { toast } from 'sonner'

export const AuthProvider=createContext()

function AuthContext({children}) {
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        async function checkAuth(){
        try{
               const result=await fetch('https://sharesphere-common-sharing-point-2.onrender.com/auth/verify',{
                method:'GET',
                credentials:'include'
               });
               const  response= await result.json();
               if(response.authenticated) setIsAuthenticated(true);
                else{
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
    async function handlelogout(){
        try{
        const res=await fetch('https://sharesphere-common-sharing-point-2.onrender.com/auth/logout',{
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
        <AuthProvider.Provider value={{isAuthenticated,loading,setIsAuthenticated,handlelogout}}>
            {children}
        </AuthProvider.Provider>
    )
}

export default AuthContext
