import React, { useState } from "react";
import { X, ShoppingCart, ShieldCheck, Zap, Star, CreditCard, Package, Check, ArrowRight } from "lucide-react";

interface ProductDetailsProps {
  product: any;
  onClose: () => void;
  getImageUrl: (path?: string) => string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose, getImageUrl }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!product) return null;

  const truncatedDescription = product.description?.length > 180 
    ? product.description.substring(0, 180) + "..." 
    : product.description;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-500"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-[1050px] max-h-[95vh] md:h-[800px] rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row relative overflow-hidden animate-in zoom-in-95 duration-700"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* LADO ESQUERDO: Showcase da Imagem */}
        <div className="w-full md:w-[45%] h-[300px] md:h-full bg-[#f8f9fb] flex items-center justify-center p-8 md:p-16 relative overflow-hidden group flex-shrink-0">
          <div className="absolute top-6 left-6 flex flex-col gap-2 scale-90 md:scale-100">
             <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-100 px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Estoque: {product.stock} un</span>
             </div>
             <div className="bg-blue-600 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-200">
                <Zap size={12} className="text-white fill-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Envio Expresso</span>
             </div>
          </div>

          <img 
            src={getImageUrl(product.image)} 
            alt={product.name} 
            className="w-full h-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-1000 ease-out" 
          />
        </div>

        {/* LADO DIREITO: Detalhes e Ações */}
        <div className="w-full md:w-[55%] h-full p-8 md:p-14 flex flex-col bg-white relative overflow-y-auto">
          
          <button onClick={onClose} className="absolute top-6 right-6 md:top-10 md:right-10 text-slate-300 hover:text-red-500 transition-all z-10">
            <X size={32} strokeWidth={1.5} />
          </button>

          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
               <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em]">Premium Nexbuy Series</span>
               <div className="h-[1px] w-8 bg-blue-100" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-950 leading-tight tracking-tighter uppercase mb-6 italic">
              {product.name}
            </h2>

            <div className="flex flex-wrap items-center gap-5 mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-1.5 h-12 bg-orange-500 rounded-full" />
                 <span className="text-3xl md:text-4xl font-black text-blue-600 tracking-tighter italic leading-none">
                   R$ {Number(product.price).toFixed(2)}
                 </span>
               </div>
               <div className="flex flex-col">
                  <div className="flex text-orange-400 gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avaliação Nexbuy</span>
               </div>
            </div>

            <div className="mb-8">
              <p className={`text-slate-500 text-sm leading-relaxed border-l-4 border-blue-600 pl-6 py-1 transition-all ${showFullDescription ? "max-h-[200px] overflow-y-auto" : ""}`}>
                {showFullDescription ? product.description : truncatedDescription}
              </p>
              {product.description?.length > 180 && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="ml-6 mt-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-orange-500 transition-colors"
                >
                  {showFullDescription ? "Ver menos" : "Ver descrição completa"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
               <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Check size={18} className="text-blue-600" /> 
                  <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Qualidade Pro</span>
               </div>
               <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <ShieldCheck size={18} className="text-blue-600" /> 
                  <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Garantia Total</span>
               </div>
            </div>

            <div className="mt-auto pt-6 flex flex-col gap-4">
               <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 h-16 md:h-20 border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[12px] uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-600 group active:scale-95">
                     <ShoppingCart size={20} />
                     Adicionar
                  </button>

                  <button className="flex-[1.5] h-16 md:h-20 bg-blue-600 hover:bg-orange-500 text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 transition-all active:scale-95 group">
                     Finalizar Compra
                     <ArrowRight size={20} />
                  </button>
               </div>
               
               <div className="flex items-center justify-between px-2 opacity-30 pb-4 md:pb-0">
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest italic">100% Seguro</span>
                  </div>
                  <div className="flex gap-4">
                     <CreditCard size={18} />
                     <Package size={18} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;