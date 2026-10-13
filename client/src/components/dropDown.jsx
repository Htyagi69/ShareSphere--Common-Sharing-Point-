import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, Trash, Share2, MoreVertical } from "lucide-react" 
import { useContext } from "react";
import { AuthProvider } from "./Context";

export function CardWithOverflow({ room, onShare, onDelete }) {
    const {theme}=useContext(AuthProvider)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        <Button variant={theme?"default":"ghost"} className="h-5 w-8 p-0 text-zinc-400 cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" /> 
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        <DropdownMenuItem onClick={() => onShare(room)} className="cursor-pointer">
          <Share2 className="mr-2 h-4 w-4" /> Share Room
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onDelete(room)} 
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <Trash className="mr-2 h-4 w-4" /> Remove / Leave
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}