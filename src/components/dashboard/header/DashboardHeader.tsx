import { useNavigate, Link } from "react-router-dom";
import { Search, X, User, Settings, Moon, LogOut, Package } from "lucide-react"; 
import { FC, useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardModais from "./DashboardModais"; 
import SearchBar from "./SearchBar";

const DashboardHeader: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  
  const [openLogout, setOpenLogout] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openOrders, setOpenOrders] = useState(false); 
  const [openSettings, setOpenSettings] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const userInitials = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : (user?.email ? user.email.charAt(0).toUpperCase() : "V");

  const displayEmail = user?.email || localStorage.getItem("@nexbuy:userEmail") || "visitante@nexbuy.com";

  useEffect(() => {
    if (!openLogout) return;
    cancelButtonRef.current?.focus();

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenLogout(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [openLogout]);


  useEffect(() => {
    const isAnyModalOpen = openLogout || openProfile || openOrders || openSettings;
    document.body.style.overflow = isAnyModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openLogout, openProfile, openOrders, openSettings]);

  const handleSearch = () => {
    if (!search.trim()) return;
    console.log("Buscando por:", search);
  };

  const handleLogout = () => {
    localStorage.removeItem("@nexbuy:token");
    localStorage.removeItem("@nexbuy:userEmail");
    navigate("/login");
  };

  return (
    <>
      <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">

        {!mobileSearchOpen && (
          <div className="flex items-center gap-2">
            <img src="NexbuyHeader.png" alt="Nexbuy" className="h-16 w-auto" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 hidden md:block">
              Nex<span className="text-orange-500">buy</span>
            </h1>
          </div>
        )}

        {mobileSearchOpen && (
          <div className="md:hidden flex-1 flex items-center gap-2 px-2">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => setMobileSearchOpen(false)} className="p-2 text-gray-400">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center gap-2 max-w-4xl ml-12 hidden md:flex">
          <div className="relative flex-1 max-w-[520px] flex justify-end">
            <SearchBar /> 
          </div>

          <nav className="flex items-center gap-12 ml-12">
            {["Início", "Categorias", "Ofertas",].map((item) => (
              <Link
                key={item}
                to={item === "Início" ? "/" : "#"}
                onClick={(e) => {
                  if (item === "Início") {
                    if (window.location.pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0 }); 
                    }
                  }
                }}
                className="cursor-pointer hover:text-blue-600 font-semibold text-gray-800 transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 ml-6">
          {!mobileSearchOpen && (
            <button onClick={() => setMobileSearchOpen(true)} className="md:hidden p-2 text-gray-400 hover:text-blue-500">
              <Search size={18} />
            </button>
          )}

          <div className="relative inline-block">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              {userInitials}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Conta NexBuy</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{displayEmail}</p>
                </div>

                <div className="flex flex-col gap-1 p-1">
                  {(user?.role === "admin" || user?.email === "visitante@nexbuy.com") && (
                    <button 
                      onClick={() => { navigate("/products"); setIsMenuOpen(false); }}
                      className="flex items-center justify-between px-3 py-2 text-sm text-blue-700 bg-blue-50/50 hover:bg-blue-100 rounded-lg transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Package size={16} className="text-blue-500" /> 
                        <span className="font-bold">Admin/Visitante - Estoque</span>
                      </div>
                    </button>
                  )}

                  <button 
                    onClick={() => { setOpenProfile(true); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group text-left w-full"
                  >
                    <User size={16} className="text-gray-400 group-hover:text-blue-500" /> 
                    <span className="font-medium">Perfil</span>
                  </button>

                  <button 
                    onClick={() => { setOpenOrders(true); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group text-left w-full"
                  >
                    <Package size={16} className="text-gray-400 group-hover:text-blue-500" /> 
                    <span className="font-medium">Meus Pedidos</span>
                  </button>

                  <button 
                    onClick={() => { setOpenSettings(true); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group text-left w-full"
                  >
                    <Settings size={16} className="text-gray-400 group-hover:text-blue-500" /> 
                    <span className="font-medium">Configurações</span>
                  </button>
                </div>

                <div className="my-1 border-t border-gray-100" />

                <div className="p-2">
                  <button
                    onClick={() => { setIsMenuOpen(false); setOpenLogout(true); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm"
                  >
                    <LogOut size={16} />
                    Sair da Conta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <DashboardModais 
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        openLogout={openLogout}
        setOpenLogout={setOpenLogout}
        openOrders={openOrders}
        setOpenOrders={setOpenOrders}
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
        handleLogout={handleLogout}
        userInitials={userInitials}
        displayEmail={displayEmail}
        userName={user?.name || "Usuário"}
        userRole={user?.role}
      />
    </>
  );
};

export default DashboardHeader;