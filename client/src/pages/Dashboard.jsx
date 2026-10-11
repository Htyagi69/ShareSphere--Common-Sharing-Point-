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
import { useState } from "react"
import { useParams } from "react-router-dom"
import PouchDb from 'pouchdb'

export default function DashBoard(){
  const {roomName}=useParams()
  const db = new PouchDb(`downloaded_files_${roomName}`);
  const  {handlelogout,userName,theme,setTheme}=useContext(AuthProvider);
  const [showLogout, setShowLogout] = useState(false);
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
