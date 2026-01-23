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

export default function DashBoard() {
  const  {handlelogout}=useContext(AuthProvider);
  return (
    <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
          <SidebarGroupLabel className='mt-11'>  <h2 className='text-green-600 text-3xl font-extrabold'>🌐ShareSphere</h2></SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent className="thin-scrollbar overflow-y-auto">
        <SidebarGroup>
          <br />
          <SidebarGroupContent>
            <SidebarMenu>
              <Pouchdb/>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='flex  items-center mt-6'>
       <Button variant="default" className='w-30 cursor-pointer text-red-700 font-extrabold' aria-label="Submit" onClick={handlelogout}>Logout</Button>
      </SidebarFooter>
    </Sidebar>
  <div className="flex flex-col w-full h-screen bg-background">
        <header className="flex h-16 items-center border-b px-4 bg-white dark:bg-zinc-950">
          <div className="flex-1 flex justify-start">
             <SidebarTrigger />
          </div>

          <div className="flex-1 flex justify-center ">
            <h1 className='text-4xl text-green-500 font-extrabold'>DashBoard</h1>
          </div>

          <div className="flex-1 flex justify-end">
            <UploadBox/>
          </div>
        </header>

        <main className="flex-1  p-0 w-full thin-scrollbar overflow-y-auto ">
          <OfflineStore />
        </main>
      </div>
    </SidebarProvider>
  )
}