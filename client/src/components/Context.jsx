import React, { useEffect,useState } from 'react'
import { createContext } from 'react'
import { toast } from 'sonner'

export const AuthProvider=createContext()

function AuthContext({children}) {
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        async function checkAuth(retries=3){
        try{
               const result=await fetch('http://localhost:3000/auth/verify',{
                method:'GET',
                credentials:'include'
               });
               const  response= await result.json();
               if(response.authenticated) setIsAuthenticated(true);
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
