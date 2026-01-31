import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  {
    id: 1,
    title: "Tecnologia Premium",
    subtitle: "Revolução sonora com cancelamento de ruído ativo.",
    buttonText: "Comprar Agora",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1600",
    color: "from-black/70"
  },
  {
    id: 2,
    title: "O Próximo Nível",
    subtitle: "Performance extrema para os setups mais exigentes.",
    buttonText: "Ver Hardware",
    image: "https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&q=80&w=1600",
    color: "from-purple-900/60"
  },
  {
    id: 3,
    title: "Estilo Urbano '26",
    subtitle: "Nova coleção exclusiva NexBuy Basics disponível.",
    buttonText: "Conferir Moda",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1600",
    color: "from-orange-900/50"
  },
  {
    id: 4,
    title: "Visão Ultra",
    subtitle: "Capture cada detalhe com as novas lentes cinematográficas.",
    buttonText: "Ver Mobiles",
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=1600",
    color: "from-blue-900/60"
  },
  {
    id: 5,
    title: "Foco no Trabalho",
    subtitle: "Produtividade e elegância para o seu espaço de trabalho.",
    buttonText: "Explorar Setup",
    image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=1600",
    color: "from-emerald-900/50"
  }
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === BANNERS.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? BANNERS.length - 1 : current - 1);

  return (
    /* ALTURA REDUZIDA: Perfeito para mostrar produtos logo abaixo */
    <section className="relative h-[180px] md:h-[260px] w-full overflow-hidden bg-gray-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <motion.div 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BANNERS[current].image})` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${BANNERS[current].color} via-transparent to-transparent`} />
          </motion.div>

          <div className="relative h-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col justify-center items-start">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter uppercase italic mb-2 drop-shadow-md">
                {BANNERS[current].title}
              </h2>
              <p className="text-xs md:text-sm text-white/90 font-medium max-w-[250px] md:max-w-md mb-4 drop-shadow-sm">
                {BANNERS[current].subtitle}
              </p>
              <button className="px-5 py-2.5 bg-white text-blue-950 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-500 hover:text-white transition-all active:scale-95">
                {BANNERS[current].buttonText}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles menores para não poluir o espaço reduzido */}
      <div className="absolute bottom-4 right-8 flex gap-2">
        <button onClick={prevSlide} className="p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white hover:text-blue-950 transition-all text-white">
          <ChevronLeft size={16} />
        </button>
        <button onClick={nextSlide} className="p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white hover:text-blue-950 transition-all text-white">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Indicadores Minimalistas */}
      <div className="absolute bottom-4 left-8 flex gap-1.5">
        {BANNERS.map((_, index) => (
          <div 
            key={index}
            className={`h-1 rounded-full transition-all duration-500 ${index === current ? 'w-4 bg-white' : 'w-1 bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}