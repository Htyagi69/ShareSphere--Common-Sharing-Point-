import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import ToggleTheme from "@/components/toggleThemebtn"
import { useState } from "react"

export default function DashBoard() {
  const  {handlelogout,userName,theme,setTheme}=useContext(AuthProvider);
  const [showLogout, setShowLogout] = useState(false);
  return (
    <SidebarProvider>
    <Sidebar>
      <SidebarHeader className={theme?'bg-black':''}>
          <SidebarGroupLabel className='mt-4'>  <h2 className='text-green-600 text-3xl font-extrabold'>🌐ShareSphere</h2></SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent className={`thin-scrollbar overflow-y-auto  ${theme? 'bg-gray-900':''}`}>
        <SidebarGroup className={theme?'bg-gray-900':''}>
          <br />
          <SidebarGroupContent>
            <SidebarMenu>
              <Pouchdb/>
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

  <div className={`flex flex-col w-full h-screen rounded-xl ${theme? 'bg-black':"bg-white"}`}>
        <header className="flex h-16 items-center border-b px-4  dark:bg-zinc-950">
          <div className="flex-1 flex justify-start">
             <SidebarTrigger variant={theme?"default":"ghost"}/>
          </div>
            <h1 className='text-4xl text-green-500 font-extrabold'>Shared Files</h1>
          <div className="flex-1 flex justify-end gap-3">
            <UploadBox/>
            <ToggleTheme className="cursor-pointer" theme={theme} setTheme={setTheme}/>
          </div>
        </header>

        <main className={`flex-1  p-0 w-full thin-scrollbar overflow-y-auto rounded-b-xl ${theme?'bg-gray-900':''}`}>
          <OfflineStore />
        </main>
      </div>
    </SidebarProvider>
  )
}
