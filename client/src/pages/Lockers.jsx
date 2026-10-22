import { useContext, useEffect, useState } from "react";
import ToggleTheme from "@/components/shadcn-space/toggle/toggleThemebtn";
import { AuthProvider } from "@/components/Context";
import Room from "@/components/room";
import { CreateDialog } from "@/components/createDialog";
import { FolderKanban, LogOut, Menu, X } from "lucide-react";
import { AvatarWithBadge } from "@/components/avatar";

export default function Lockers() {
  const { handlelogout, userMail, theme, setTheme, userName, profileImage } = useContext(AuthProvider);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!userMail) return;
    const fetchRooms = async () => {
      const cacheKey = `subscribed_rooms_${userMail}`;
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
          // console.log("list", rooms);
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
    <div className={`flex flex-col w-full min-h-screen ${theme ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      <header className={`flex h-20 items-center justify-between px-4 md:px-6 border-b ${theme ? 'border-zinc-800 bg-zinc-900/50 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md'} sticky top-0 z-10`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-green-500">Lockers</h1>
            <p className="text-xs text-zinc-400 font-medium hidden sm:block">Your Secure ShareSphere Rooms</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <CreateDialog setCards={setCards} userMail={userMail} />
          <ToggleTheme className="cursor-pointer" theme={theme} setTheme={setTheme} />
          
          <div 
            className="flex gap-2 items-center cursor-pointer select-none hover:opacity-80 transition-opacity relative" 
            onClick={() => setShow(!show)}
          > 
            <AvatarWithBadge profileImage={profileImage} /> 
            <strong className="text-sm">{userName}</strong>
          </div> 

          {show && handlelogout && (
            <button 
              onClick={handlelogout}
              title="Logout"
              className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <div 
            className="flex items-center cursor-pointer select-none" 
            onClick={() => setShow(!show)}
          >
            <AvatarWithBadge profileImage={profileImage} />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-xl border ${theme ? 'border-zinc-800 bg-zinc-900 text-zinc-200' : 'border-slate-200 bg-slate-100 text-slate-800'}`}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className={`md:hidden flex flex-col space-y-4 p-4 border-b ${theme ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'} animate-in slide-in-from-top-2 duration-200 shadow-xl`}>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/50">
            <span className="text-sm font-bold text-zinc-400">Signed in as <span className="text-green-500">{userName}</span></span>
            {handlelogout && (
              <button 
                onClick={handlelogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 text-xs font-semibold bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Appearance</span>
            <ToggleTheme className="cursor-pointer" theme={theme} setTheme={setTheme} />
          </div>

          <div className="pt-2">
            <CreateDialog setCards={setCards} userMail={userMail} />
          </div>
        </div>
      )}

      {/* Profile Popup Dropdown for Desktop when clicked */}
      {show && handlelogout && (
        <div className="hidden md:block absolute right-6 top-20 z-50 p-3 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl">
          <button 
            onClick={handlelogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout ({userName})</span>
          </button>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 overflow-y-auto thin-scrollbar max-w-7xl mx-auto w-full">
        <Room cards={cards} loading={loading} theme={theme} />
      </main>
    </div>
  );
}