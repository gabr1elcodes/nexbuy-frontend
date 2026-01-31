import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails";
import { getAllProducts } from "../../../services/products/products.service";
import { Sparkles } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const getImageUrl = (path?: string) => {
    if (!path || path === "") return "https://via.placeholder.com/300?text=Sem+Foto";
    if (path.startsWith("http")) return path;
    let cleanPath = path.replace(/\\/g, "/").trim();
    if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
    return `${API_URL}/uploads/${cleanPath.replace("uploads/", "")}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.filter((p: any) => p.stock > 0));
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-16 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles size={20} className="text-orange-500" />
        <h2 className="text-3xl font-black text-blue-950 uppercase italic tracking-tighter">
          Nossa Vitrine
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={`R$ ${Number(product.price).toFixed(2)}`}
            image={getImageUrl(product.image)}
            rating="4.9"
            reviews={120}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          getImageUrl={getImageUrl}
        />
      )}
    </div>
  );
};

export default Products;
