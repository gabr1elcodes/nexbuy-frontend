import { FC, useState, useEffect } from "react";
import { 
  Monitor, Smartphone, Watch, 
  Gamepad2, Shirt, Camera, 
  ChevronRight, Sparkles 
} from "lucide-react";

const CATEGORIES = [
  { id: 1, name: "Tech", icon: Monitor, items: "2.4k+ produtos", color: "from-blue-500" },
  { id: 2, name: "Mobile", icon: Smartphone, items: "1.8k+ produtos", color: "from-purple-500" },
  { id: 3, name: "Moda", icon: Shirt, items: "5.2k+ produtos", color: "from-orange-500" },
  { id: 4, name: "Gaming", icon: Gamepad2, items: "950 produtos", color: "from-red-500" },
  { id: 5, name: "Acessórios", icon: Watch, items: "3.1k+ produtos", color: "from-emerald-500" },
  { id: 6, name: "Foto", icon: Camera, items: "420 produtos", color: "from-cyan-500" },
];

const CategoriesSection: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-2 md:pt-4 pb-0 mb-0 px-6 md:px-16 max-w-7xl mx-auto"> 
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Sparkles size={14} className="text-orange-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">Explorar</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-blue-950 tracking-tighter uppercase italic leading-none">
            Categorias
          </h2>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 group">
          Ver todas <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Grid: gap-3 mantido para proximidade ideal */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="relative group cursor-pointer">
            {isLoading ? (
              <div className="h-48 w-full bg-gray-100 rounded-[2.5rem] animate-pulse" />
            ) : (
              <div className="relative h-48 w-full bg-white border border-gray-100 rounded-[2.5rem] p-4 flex flex-col items-center justify-center transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                
                <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`} />
                
                <div className="relative mb-4">
                  <div className="relative p-4 bg-gray-50 rounded-2xl text-blue-950 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <cat.icon size={28} strokeWidth={1.5} />
                  </div>
                </div>

                <span className="text-sm font-black text-blue-950 uppercase tracking-tight mb-1 text-center">{cat.name}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{cat.items}</span>

                <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <div className="w-1 h-1 bg-orange-500 rounded-full" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;