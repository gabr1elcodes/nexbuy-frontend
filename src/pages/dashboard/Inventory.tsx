import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Package,
  Image as ImageIcon,
  Search,
  AlertCircle,
  LayoutDashboard,
  Tag,
  Sun,
  Moon,
} from "lucide-react";

import api from "@/services/api";

const API_URL = import.meta.env.VITE_API_URL;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image?: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  stock: string;
  file: File | null;
  previewUrl: string | null;
}

export default function Inventory() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: "",
    file: null,
    previewUrl: null,
  });

  const getImageUrl = (image?: string) => {
    if (!image) return "https://via.placeholder.com/400x260?text=NexBuy+Product";
    if (image.startsWith("http") || image.startsWith("blob:")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setProducts(data);
    } catch {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      oldPrice: "",
      stock: "",
      file: null,
      previewUrl: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      stock: String(product.stock),
      file: null,
      previewUrl: getImageUrl(product.image),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (formData.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(formData.previewUrl);
    }
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(editingProduct ? "Salvando..." : "Cadastrando...");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("oldPrice", formData.oldPrice);
      data.append("stock", formData.stock);
      if (formData.file) data.append("image", formData.file);

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        toast.success("Atualizado!", { id: toastId });
      } else {
        await api.post("/products", data);
        toast.success("Criado!", { id: toastId });
      }

      closeModal();
      loadProducts();
    } catch {
      toast.error("Erro na operação", { id: toastId });
    }
  };

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className={`flex flex-col gap-3 min-w-[250px] p-1 ${!isDarkMode && 'text-slate-800'}`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="text-orange-500" size={20} />
          <span className="font-medium text-sm">Excluir este produto?</span>
        </div>
        <div className="flex justify-end gap-2">
          <button 
            type="button"
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-md transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={async () => {
              toast.dismiss(t.id);
              const tid = toast.loading("Excluindo...");
              try {
                await api.delete(`/products/${id}`);
                toast.success("Removido!", { id: tid });
                loadProducts();
              } catch { 
                toast.error("Erro!", { id: tid }); 
              }
            }}
            className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans pb-20 ${isDarkMode ? 'bg-[#0f172a] text-slate-200' : 'bg-[#f8fafc] text-slate-800'}`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] ${isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/10'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] ${isDarkMode ? 'bg-purple-600/10' : 'bg-purple-400/10'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-8">
        <header className={`flex flex-col md:flex-row gap-6 items-center justify-between backdrop-blur-md p-6 rounded-[2rem] border transition-all duration-300 shadow-2xl ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 shadow-lg shadow-blue-500/20">
              <Package className="text-white" size={28} />
            </div>
            <div>
              <h1 className={`text-2xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Nex<span className="text-orange-500">Buy</span> <span className={`font-light ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>MarketPlace</span>
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                <LayoutDashboard size={12} className="text-blue-500" /> Gestão de Ativos
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-xl border transition shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => navigate("/")} className={`flex-1 md:flex-none px-6 py-3 rounded-xl border transition text-sm font-bold flex items-center justify-center gap-2 ${isDarkMode ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
              <ArrowLeft size={18} /> Painel
            </button>
            <button onClick={openCreateModal} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2">
              <Plus size={20} /> Adicionar
            </button>
          </div>
        </header>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Filtrar por nome do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-sm font-medium ${isDarkMode ? 'bg-slate-800/40 border-slate-700 focus:ring-orange-500 placeholder:text-slate-600' : 'bg-white border-slate-200 focus:ring-blue-500 placeholder:text-slate-400 shadow-sm'}`}
          />
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-slate-500 font-bold uppercase tracking-widest">Sincronizando...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className={`group border rounded-[2rem] overflow-hidden transition-all duration-300 shadow-xl ${isDarkMode ? 'bg-slate-800/30 border-slate-700/50 hover:border-orange-500/50 shadow-black/20' : 'bg-white border-slate-100 hover:border-blue-500/30 shadow-slate-200'}`}>
                <div className="relative h-48">
                  <img src={getImageUrl(product.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent`} />
                  
                  {product.oldPrice && Number(product.oldPrice) > product.price && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase shadow-lg shadow-orange-500/40">
                      Promoção
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase border bg-white/10 backdrop-blur-md border-white/20">
                      Qtd: {product.stock}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className={`font-bold truncate transition-colors ${isDarkMode ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-blue-600'}`}>{product.name}</h3>
                    <p className={`text-xs line-clamp-1 mt-1 font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{product.description}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    {product.oldPrice && Number(product.oldPrice) > 0 && (
                      <span className="text-xs text-slate-400 line-through font-bold">R$ {Number(product.oldPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button onClick={() => openEditModal(product)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${isDarkMode ? 'bg-slate-700/50 hover:bg-blue-600 text-white border-slate-600' : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'}`}>
                      <Pencil size={14} /> Editar
                    </button>
                    <button onClick={() => handleDelete(product._id)} className={`px-3 flex items-center justify-center rounded-xl transition-all border ${isDarkMode ? 'bg-slate-700/50 hover:bg-red-500/20 text-slate-500 hover:text-red-500 border-slate-600' : 'bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 border-slate-200'}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`border rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-3xl ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Tag size={20} className="text-orange-400" />
                  {editingProduct ? "Refinar Item" : "Novo Cadastro"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-4">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome do produto"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full border rounded-xl p-3.5 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-purple-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500'}`}
                    required
                  />
                  
                  <textarea
                    placeholder="Descrição técnica"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full border rounded-xl p-3.5 outline-none transition-all h-24 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-purple-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500'}`}
                    required
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Preço Atual</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className={`w-full border rounded-xl p-3 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase ml-1 ${isDarkMode ? 'text-orange-500/80' : 'text-orange-600'}`}>P. Antigo</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.oldPrice}
                        onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                        className={`w-full border rounded-xl p-3 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Estoque</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className={`w-full border rounded-xl p-3 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        required
                      />
                    </div>
                  </div>

                  <label className={`flex items-center gap-4 p-4 border-2 border-dashed rounded-xl cursor-pointer transition group ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                    {formData.previewUrl ? (
                      <img src={formData.previewUrl} className="w-12 h-12 rounded-lg object-cover" alt="Preview" />
                    ) : (
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <ImageIcon className={`${isDarkMode ? 'text-slate-600 group-hover:text-orange-500' : 'text-slate-400 group-hover:text-blue-500'}`} />
                      </div>
                    )}
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Foto do Produto</span>
                    <input type="file" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100/10">
                  <button type="button" onClick={closeModal} className={`px-6 py-2 font-bold transition ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>Cancelar</button>
                  <button type="submit" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition shadow-lg shadow-orange-500/20 active:scale-95">
                    {editingProduct ? "Atualizar" : "Salvar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}