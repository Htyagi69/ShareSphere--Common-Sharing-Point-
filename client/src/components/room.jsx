import { Folder, ArrowRight, Sparkles,MoreHorizontal,MoreVertical } from "lucide-react";
import { CardWithOverflow } from "./dropDown";
import {toast} from "sonner"

export default function Room({ cards, loading, theme }) {
  const shareUri=async(room)=>{
    const uri=await fetch(`${import.meta.env.VITE_API_BASE_URL}/${room.roomSlug}/generate-invite`,{
      method:"POST",
      credentials:'include'
    }) 
    const response=await uri.json();
    if(uri.ok){
      await navigator.clipboard.writeText(response.inviteLink);
        toast.success(`${response.message} valid till ${response.expiresAt}`,{ position: "bottom-right" });
      }
      else{
         toast.error(`${response.message}`,{ position: "bottom-right" });
       }
   }
    const unsubscribe=async(room)=>{
       const userState=await fetch(`${import.meta.env.VITE_API_BASE_URL}/unsubscribe`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:json.stringify(room.roomSlug),
        credentials:'include'
       }) 
       const response=await userState.json();
       if(userState.ok){
       toast.success(`Deleted ${room.roomName}!`,{ position: "bottom-right" });
       window.location.href=`/`
      }
      else{
         toast.error(`${response.message}`,{ position: "bottom-right" });
       }
   }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`h-36 rounded-2xl ${theme ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'} border p-5 flex flex-col justify-between`}>
            <div className="w-10 h-10 rounded-xl bg-zinc-800/40" />
            <div className="space-y-2">
              <div className="w-3/4 h-4 bg-zinc-800/40 rounded" />
              <div className="w-1/2 h-3 bg-zinc-800/30 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[65vh] text-center px-4">
        <div className="p-4 rounded-full bg-green-500/10 text-green-500 mb-4 border border-green-500/20">
          <Sparkles className="w-8 h-8 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-1">No Lockers Found</h2>
        <p className="text-sm text-zinc-400 max-w-sm mb-6">
          You haven't joined or created any rooms yet. Click the <span className="text-green-500 font-semibold">"Create Room"</span> button above to get started!
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {cards.map((room, index) => (
        <a 
          href={`/${room.roomSlug}`} 
          key={index}
          className="group block transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className={`h-36 p-5 flex flex-col justify-between rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            theme 
              ? 'bg-zinc-900/80 border-zinc-800 hover:border-green-500/50 hover:shadow-[0_8px_30px_rgb(34,197,94,0.12)]' 
              : 'bg-white border-slate-200 hover:border-green-500/40 hover:shadow-xl'
          }`}>
        <div className="absolute top-0.5 right-0.5">
         <CardWithOverflow 
          room={room} 
          onShare={async(r) => {
          await  shareUri(r)
          }}
          onDelete={async(r) => {
            await unsubscribe(r);
          }}
          /> 
          </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
                <Folder className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                Active
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-tight capitalize truncate group-hover:text-green-500 transition-colors">
                  {room.roomName}
                </h3>
                <p className="text-xs text-zinc-400">Click to enter locker</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}