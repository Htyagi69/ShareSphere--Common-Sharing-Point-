import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import OfflineStore from "./OfflineStore"
import Pouchdb from "./pouchdb"
import { UploadBox } from "@/components/upload_dialogbox"
import { Button } from "@/components/ui/button"
import { useContext } from "react"
import { AuthProvider } from "@/components/Context"
import { LogOut } from "lucide-react"
import { AvatarWithBadge } from "@/components/avatar"
import ToggleTheme from "@/components/shadcn-space/toggle/toggleThemebtn"
import { useState,useEffect } from "react"
import { useParams,useNavigate } from "react-router-dom"
import PouchDb from 'pouchdb'
import { Loader2 ,ShieldAlert} from "lucide-react"

export default function DashBoard(){
  const {roomName}=useParams()
  const navigate=useNavigate()
  const [isAuthorized,setIsAuthorized]=useState(null)
  const db = new PouchDb(`downloaded_files_${roomName}`);
  const  {handlelogout,userName,theme,setTheme}=useContext(AuthProvider);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(()=>{
      const verifyAcess=async()=>{
        try{
            const res=await fetch(`${import.meta.env.VITE_API_BASE_URL}/${roomName}/verification`,{
                method:'GET',
                credentials:'include'
            })
            if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Access denied");
        }
        const data=await res.json();
        setIsAuthorized(true);
        }catch(err){
            console.error("Authorization check failed:", err);
           setIsAuthorized(false);
        }
      }
      verifyAcess()
    },[roomName])

  if (isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-green-500 mb-2" />
        <p className="text-sm text-zinc-400">Verifying locker clearance...</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-white px-4">
        <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-1">Access Denied</h2>
        <p className="text-sm text-zinc-400 text-center max-w-sm mb-6">
          You do not have permission to view this locker, or it does not exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-xl bg-green-500 text-zinc-950 font-bold hover:bg-green-400 transition-colors cursor-pointer"
        >
          Return to My Lockers
        </button>
      </div>
    );
  }
  return (
    <SidebarProvider>
    <Sidebar>
      <SidebarHeader className={theme?'bg-black':''}>
          <SidebarGroupLabel className='mt-4'>  <h2 className='text-green-600 text-3xl font-extrabold flex gap-2'><img src="./ShareSphere1.png" className="w-10 h-10 rounded-2xl"/> ShareSphere</h2></SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent className={`thin-scrollbar overflow-y-auto  ${theme? 'bg-gray-900':''}`}>
        <SidebarGroup className={theme?'bg-gray-900':''}>
          <br />
          <SidebarGroupContent>
            <SidebarMenu>
              <Pouchdb dburi={db}/>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
       <SidebarFooter className={`flex flex-col items-start gap-3 p-4 justify-center relative ${theme ? 'bg-black text-white' : ''}`}>
      <div 
        className="flex gap-2 items-center cursor-pointer select-none w-full hover:opacity-80 transition-opacity" 
        onClick={() => setShowLogout(!showLogout)}
      > 
        <AvatarWithBadge/> 
        <strong className="mt-1">{userName}</strong>
      </div> 
      {showLogout && (
        <Button 
          className="w-30 cursor-pointer bg-gray-400 text-black font-extrabold hover:text-red-500 hover:bg-transparent hover:border-red-500 hover:border-2 flex items-center gap-1 transition-all" 
          aria-label="Logout" 
          onClick={handlelogout}
        >
          <LogOut size={16}/>
          Logout
        </Button>
      )}

    </SidebarFooter>
  </Sidebar>

   <div className={`flex flex-col w-full h-screen ${theme ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
       <header className={`flex h-16 items-center justify-between px-6 border-b ${theme ? 'border-zinc-800 bg-zinc-900/50 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md'} sticky top-0 z-10`}>
          <div className="flex-1 flex justify-start">
             <SidebarTrigger variant={theme?"default":"ghost"}/>
          </div>
            <h1 className='text-3xl text-green-500 font-extrabold'>Shared Files</h1>
          <div className="flex-1 flex justify-end gap-3">
            <UploadBox/>
            <ToggleTheme className="cursor-pointer" theme={theme} setTheme={setTheme} />
          </div>  
        </header>

        <main className={`flex-1  p-0 w-full thin-scrollbar overflow-y-auto rounded-b-xl ${theme?'bg-gray-900':''}`}>
          <OfflineStore db={db}/>
        </main>
      </div>
    </SidebarProvider>
  )
}
