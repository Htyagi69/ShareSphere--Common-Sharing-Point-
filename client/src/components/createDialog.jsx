import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"

export function CreateDialog({setCards,userMail}) {
    const [open,setOpen]=useState(false)

    const createRoom = async (e) =>{
        e.preventDefault();
       const formData=new FormData(e.currentTarget)
       const roomName=formData.get("name");
       if(!roomName) return;
       e.currentTarget.reset()
       console.log("New Locker Name:", roomName);
       setOpen(false)
       try{
         const createDBfolder=await fetch(`${import.meta.env.VITE_API_BASE_URL}/${roomName}`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            credentials:"include"
          })
          if (!createDBfolder.ok) {
            throw new Error("Failed to create room database on the server");
          }
          const data = await createDBfolder.json();
             setCards(prev=>[...prev,{roomName:roomName.toLowerCase(),roomSlug:data.roomSlug,tag:data.tag}])
             console.log(`Database folder for ${roomName} ready!${data.roomSlug} with tag ${data.tag}`);
             sessionStorage.removeItem(`subscribed_rooms_${userMail}`);
       }catch(error){
        console.error("Error setting up server room database:", error);
       }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button variant="default" className="font-bold hover:bg-gray-500 cursor-pointer">
          <Plus size={20} className="mr-1"/> Create
        </Button></DialogTrigger>
        <DialogContent className="sm:max-w-sm">
      <form onSubmit={createRoom}>
          <DialogHeader>
            <DialogTitle>Create a new Locker</DialogTitle>
            <DialogDescription>
              Make your separate room. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="" />
            </Field>
            {/* <Field>
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field> */}
          </FieldGroup>
          <DialogFooter className="mt-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
      </form>
        </DialogContent>
    </Dialog>
  )
}
