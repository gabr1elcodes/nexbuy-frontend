import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails";
import { getAllProducts } from "../../../services/products/products.service";
import { Sparkles } from "lucide-react";
import api from "@/services/api";

const API_URL = import.meta.env.VITE_API_URL;

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const getImageUrl = (path?: string) => {
    if (!path || path === "") return "https://via.placeholder.com/300?text=Sem+Foto";
    if (path.startsWith("http")) return path;
    let cleanPath = path.replace(/\\/g, "/").trim();
    if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
    const fileName = cleanPath.replace("uploads/", "");
    return `${API_URL}/uploads/${fileName}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const availableProducts = data.filter((p: any) => p.stock > 0);
        setProducts(availableProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProducts();
  }, []);

  const limit = 6;
  const displayedProducts = isExpanded ? products : products.slice(0, limit);

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-16 pt-0 pb-8 mt-0">
      <div className="flex items-end gap-2 mb-4 mt-0">
        <div className="mt-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Sparkles size={14} className="text-orange-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">
              Vitrine
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-blue-950 tracking-tighter uppercase italic leading-none">
            Produtos em Destaque
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayedProducts.map((product, index) => {
          const dynamicRating = (4.7 + (index % 4) * 0.1).toFixed(1);
          const dynamicReviews = 24 + index * 15;
          const badges = ["Novo", "Oferta", "Premium", "Trend"];
          const currentBadge = index % 5 === 0 ? badges[index % 4] : undefined;

          return (
            <ProductCard
              key={product._id}
              name={product.name}
              price={`R$ ${Number(product.price).toFixed(2)}`}
              oldPrice={
                product.oldPrice
                  ? `R$ ${Number(product.oldPrice).toFixed(2)}`
                  : undefined
              }
              image={getImageUrl(product.image)}
              rating={dynamicRating}
              reviews={dynamicReviews}
              badge={currentBadge}
              onClick={() => setSelectedProduct(product)}
            />
          );
        })}
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          getImageUrl={getImageUrl}
        />
      )}

      {products.length > limit && (
        <div className="mt-8 flex flex-col items-center justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group relative flex items-center justify-center w-full max-w-[320px] h-[55px] bg-white border-2 border-blue-600 text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95"
          >
            <span>{isExpanded ? "Ver menos" : "Ver todos os produtos"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
