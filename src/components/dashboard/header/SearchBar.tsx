import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, Package } from "lucide-react";
import api from "../../../services/api";
import ProductDetails from "../products/ProductDetails";

const SearchBar = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Estados e funções adicionados para o Modal
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const getImageUrl = (path?: string) => {
    if (!path) return "https://placehold.co/600x600?text=Nexbuy";
    return `${API_URL}/uploads/${path}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchFocus = async () => {
    setIsOpen(true);
    if (products.length > 0) return;
    setLoading(true);

    try {
      const response = await api.get("/products");
      console.log("Dados recebidos da API:", response.data);

      setTimeout(() => {
        let dataArray: any[] = [];

        if (Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (
          response.data &&
          Array.isArray(response.data.products)
        ) {
          dataArray = response.data.products;
        }

        setProducts(dataArray);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      <div className="relative group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
          size={18}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleSearchFocus}
          placeholder="Buscar produtos na Nexbuy..."
          className={`w-full pl-12 pr-6 py-3 rounded-full bg-white transition-all font-medium text-slate-700 outline-none border-2 ${
            isOpen
              ? "border-blue-500 shadow-[0_15px_35px_-5px_rgba(59,130,246,0.4)] ring-4 ring-blue-50"
              : "border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.15)] hover:border-gray-300"
          }`}
        />
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 w-full mt-3 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{ zIndex: 9999 }}
        >
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                    <div className="h-2 bg-slate-50 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center py-2 text-slate-400 gap-2">
                <Loader2 size={16} className="animate-spin text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Localizando produtos...
                </span>
              </div>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 6).map((item) => (
                  <div
                    key={item.id || item._id}
                    onClick={() => {
                      setSelectedProduct(item);
                      setIsOpen(false);
                    }}
                    className="p-4 hover:bg-blue-50/50 cursor-pointer flex items-center gap-4 transition-all group border-b border-slate-50 last:border-0"
                  >
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl p-2 group-hover:bg-white transition-colors flex items-center justify-center overflow-hidden">
                      <img
                        src={getImageUrl(item.image)}
                        className="w-full h-full object-contain"
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/100x100?text=Nexbuy";
                        }}
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase italic leading-tight">
                        {item.name}
                      </span>
                      <span className="text-xs font-black text-blue-600 mt-1">
                        R${" "}
                        {Number(item.price || 0).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center flex flex-col items-center gap-3">
                  <Package className="text-slate-200" size={40} />
                  <span className="text-sm font-bold text-slate-400">
                    {searchTerm
                      ? `Nenhum resultado para "${searchTerm}"`
                      : "Nenhum produto cadastrado"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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

export default SearchBar;
