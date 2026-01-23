import Upload from "@/pages/upload"
import { Button } from "./ui/button"
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


export function UploadBox() {
  return (
   <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className='hover:bg-gray-500 cursor-pointer'>Upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload</DialogTitle>
          <DialogDescription>
            Anyone  can upload anything into it
          </DialogDescription>
        </DialogHeader> 
            <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Upload/>
          </div>
        </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
