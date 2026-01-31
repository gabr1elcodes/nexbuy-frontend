import React from "react";
import { ShoppingCart, Heart, Star } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
  rating: string;
  reviews: number;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  price, 
  oldPrice, 
  image, 
  badge, 
  rating, 
  reviews,
  onClick
}) => {
  return (
    <div onClick={(e) => {
      e.stopPropagation();
      console.log("Clique detectado no Card!");
      if (onClick) onClick();
    }}
     className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-3 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden">
      
      {badge && (
        <div className="absolute top-5 left-5 z-10">
          <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            {badge}
          </span>
        </div>
      )}

      <div className="relative h-64 w-full bg-gray-50 rounded-[2rem] overflow-hidden mb-4">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart size={16} fill="currentColor" className="fill-transparent hover:fill-red-500" />
        </button>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-blue-950 text-white flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl hover:bg-orange-500">
            <ShoppingCart size={18} />
            Compra Rápida
          </button>
        </div>
      </div>

      <div className="px-2">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1 text-orange-400">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-bold text-gray-400">
              {rating} ({reviews})
            </span>
          </div>
        </div>
        
        <h3 className="text-sm font-black text-blue-950 uppercase tracking-tight line-clamp-1 mb-1">
          {name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-blue-950 tracking-tighter italic">
            {price}
          </span>
          
          {/* EXIBIÇÃO DINÂMICA: Só aparece se existir no banco */}
          {oldPrice && (
            <span className="text-[10px] text-gray-400 font-bold line-through opacity-50">
              {oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;