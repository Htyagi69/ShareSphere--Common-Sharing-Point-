import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar"
import OfflineStore from "./OfflineStore"
import Pouchdb from "./pouchdb"
import { UploadBox } from "@/components/upload_dialogbox"
import { Button } from "@/components/ui/button"
import { useContext, useState, useEffect } from "react"
import { AuthProvider } from "@/components/Context"
import { LogOut, Loader2, ShieldAlert } from "lucide-react"
import { AvatarWithBadge } from "@/components/avatar"
import ToggleTheme from "@/components/shadcn-space/toggle/toggleThemebtn"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import PouchDb from 'pouchdb'

export default function DashBoard(){
  const { roomName } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("loading")
  const db = new PouchDb(`downloaded_files_${roomName}`);
  const { handlelogout, userName, theme, setTheme, profileImage } = useContext(AuthProvider);
  const [showLogout, setShowLogout] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const token = searchParams.get("token")
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=>{
    const handleEntry = async () => {
      try {         
        if (token) {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${roomName}/join?token=${token}`,{
            method: 'POST',
            credentials: 'include'
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || "Failed to join room");
          setRoomData(data)
          setStatus("joining_success")
        } else {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${roomName}/verification`,{
            method: 'GET',
            credentials: 'include'
          })
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Access denied");
          }
          const data = await res.json();
          setRoomData(data)
          setStatus("authorized");
        }
      } catch(err){
        console.error("Authorization check failed:", err);
        setErrorMessage(err.message || "You do not have permission to view this locker.");
        setStatus("error");
      }
    }
    handleEntry()
  }, [roomName, token])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-green-500 mb-2" />
        <p className="text-sm text-zinc-400">
          {token ? "Processing secure invite token..." : "Verifying locker clearance..."}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-white px-4">
        <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-1">Access Denied</h2>
        <p className="text-sm text-zinc-400 text-center max-w-sm mb-6">{errorMessage}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-xl bg-green-500 text-zinc-950 font-bold hover:bg-green-400 transition-colors cursor-pointer"
        >
          Return to My Lockers
        </button>
      </div>
    );
  }

  if (status === "joining_success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-white px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center shadow-xl">
          <h1 className="text-2xl font-black mt-3 mb-1 capitalize">
            {roomData?.roomName || roomName}
          </h1>
          <p className="text-sm text-zinc-400 mb-6">
            You have successfully joined this secure locker. It has been added to your dashboard stack.
          </p>
          <button
            onClick={() => {
              sessionStorage.clear()
              navigate(`/${roomName}`, { replace: true });
              setStatus("authorized");
            }}
            className="w-full py-2.5 rounded-xl bg-green-500 text-zinc-950 font-bold hover:bg-green-400 transition-colors cursor-pointer"
          >
            Enter Locker Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className={theme ? 'bg-black' : ''}>
          <SidebarGroupLabel className='mt-4'>  
            <h2 className='text-green-600 text-2xl md:text-3xl font-extrabold flex items-center gap-2'>
              <img src="./ShareSphere1.png" className="w-8 h-8 md:w-10 md:h-10 rounded-2xl" alt="Logo" /> 
              ShareSphere
            </h2>
          </SidebarGroupLabel>
        </SidebarHeader>
        <SidebarContent className={`thin-scrollbar overflow-y-auto ${theme ? 'bg-gray-900' : ''}`}>
          <SidebarGroup className={theme ? 'bg-gray-900' : ''}>
            <br />
            <SidebarGroupContent>
              <SidebarMenu>
                <Pouchdb dburi={db} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className={`flex flex-col items-start gap-3 p-4 justify-center relative ${theme ? 'bg-black text-white' : ''}`}>
          <div 
            className="flex gap-2 items-center cursor-pointer select-none w-full hover:opacity-80 transition-opacity" 
            onClick={() => setShowLogout(!showLogout)}
          > 
            <AvatarWithBadge profileImage={profileImage} /> 
            <strong className="mt-1 text-sm">{userName}</strong>
          </div> 
          {showLogout && (
            <Button 
              className="w-full cursor-pointer bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500 hover:text-white flex items-center gap-2 transition-all" 
              aria-label="Logout" 
              onClick={handlelogout}
            >
              <LogOut size={16} />
              Logout
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>

      <div className={`flex flex-col w-full h-screen ${theme ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
        <header className={`flex h-16 items-center justify-between px-3 md:px-6 border-b ${theme ? 'border-zinc-800 bg-zinc-900/50 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md'} sticky top-0 z-10`}>
          <div className="flex items-center gap-2">
            <SidebarTrigger variant={theme ? "default" : "ghost"} />
            <h1 className='text-lg md:text-3xl text-green-500 font-extrabold truncate'>Shared Files</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <UploadBox />
            <ToggleTheme className="cursor-pointer" theme={theme} setTheme={setTheme} />
          </div>  
        </header>

        <main className={`flex-1 p-0 w-full thin-scrollbar overflow-y-auto rounded-b-xl ${theme ? 'bg-gray-900' : ''}`}>
          <OfflineStore db={db} />
        </main>
      </div>
    </SidebarProvider>
  )
}