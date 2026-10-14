import { useContext, useEffect, useState } from "react";
import ToggleTheme from "@/components/shadcn-space/toggle/toggleThemebtn";
import { AuthProvider } from "@/components/Context";
import Room from "@/components/room";
import { CreateDialog } from "@/components/createDialog";
import { FolderKanban, LogOut } from "lucide-react";
import { AvatarWithBadge } from "@/components/avatar"

export default function Lockers() {
  const { handlelogout, userMail, theme, setTheme,userName } = useContext(AuthProvider);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show,setShow]=useState(false)

  useEffect(() => {
    if(!userMail) return;
    const fetchRooms = async () => {
      const cacheKey=`subscribed_rooms_${userMail}`
      const cachedRooms = sessionStorage.getItem(cacheKey);
      if (cachedRooms) {
        console.log("Loading rooms from browser session cache");
        setCards(JSON.parse(cachedRooms));
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscribed/rooms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });
        if (response.ok) {
          const result = await response.json();
          const rooms = result.lockers || [];
          console.log("list", rooms);
          sessionStorage.setItem(cacheKey, JSON.stringify(rooms));
          setCards(rooms);
        } else {
          console.error("Failed to fetch rooms, status:", response.status);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [userMail]);

  return (
    <div className={`flex flex-col w-full h-screen ${theme ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      <header className={`flex h-20 items-center justify-between px-6 border-b ${theme ? 'border-zinc-800 bg-zinc-900/50 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md'} sticky top-0 z-10`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-green-500">Lockers</h1>
            <p className="text-xs text-zinc-400 font-medium">Your Secure ShareSphere Rooms</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CreateDialog setCards={setCards} userMail={userMail} />
          <ToggleTheme className="cursor-pointer" theme={theme} setTheme={setTheme} />
          <div 
            className="flex gap-2 items-center cursor-pointer select-none w-full hover:opacity-80 transition-opacity" 
            onClick={() => setShow(!show)}
          > 
            <AvatarWithBadge/> 
            <strong className="mt-1">{userName}</strong>
          </div> 
          {show && handlelogout && (
            <button 
              onClick={handlelogout}
              title="Logout"
              className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto thin-scrollbar max-w-7xl mx-auto w-full">
        <Room cards={cards} loading={loading} theme={theme} />
      </main>
    </div>
  );
}