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
} from "lucide-react";

import api from "@/services/api";

const API_URL = import.meta.env.VITE_API_URL;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
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

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
    file: null,
    previewUrl: null,
  });

  /* =========================
      HELPERS
  ========================= */

  const getImageUrl = (image?: string) => {
    if (!image) return "https://via.placeholder.com/400x260?text=NexBuy+Product";
    if (image.startsWith("http") || image.startsWith("blob:")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* =========================
      API
  ========================= */

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

  /* =========================
      MODAL LOGIC
  ========================= */

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
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

  /* =========================
      FORM ACTIONS
  ========================= */

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
    const toastId = toast.loading(editingProduct ? "Salvando alterações..." : "Cadastrando produto...");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      if (formData.file) data.append("image", formData.file);

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        toast.success("Produto atualizado!", { id: toastId });
      } else {
        await api.post("/products", data);
        toast.success("Produto criado!", { id: toastId });
      }

      closeModal();
      loadProducts();
    } catch {
      toast.error("Erro na operação", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este item do estoque?")) return;
    const toastId = toast.loading("Removendo...");
    try {
      await api.delete(`/products/${id}`);
      toast.success("Removido com sucesso", { id: toastId });
      loadProducts();
    } catch {
      toast.error("Erro ao remover", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-8">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 shadow-lg shadow-blue-500/20">
              <Package className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white bg-clip-text">
                Nex<span className="text-orange-500">Buy</span> Inventory
              </h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <LayoutDashboard size={14} /> Gestão estratégica de ativos
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate("/")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-600 bg-slate-800/50 hover:bg-slate-700 transition-all text-sm font-medium"
            >
              <ArrowLeft size={18} /> Voltar
            </button>
            <button
              onClick={openCreateModal}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={20} /> Novo Produto
            </button>
          </div>
        </header>

        {/* SEARCH & FILTERS */}
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar no inventário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        {/* MAIN CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 animate-pulse font-medium">Sincronizando dados...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
            <div className="p-6 bg-slate-800 rounded-full mb-4">
              <ImageIcon size={48} className="text-slate-600" />
            </div>
            <p className="text-xl font-semibold text-slate-400">Nenhum item encontrado</p>
            <p className="text-slate-500">Tente ajustar sua busca ou adicione um novo produto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${
                      product.stock > 10 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : product.stock > 0 
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                      {product.stock > 0 ? `Estoque: ${product.stock}` : "Esgotado"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-white truncate group-hover:text-orange-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Preço Unitário</p>
                      <p className="text-2xl font-black text-white">
                        <span className="text-blue-500 text-sm mr-1">R$</span>
                        {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-700/50 hover:bg-blue-600 text-white text-sm font-semibold transition-all border border-slate-600 hover:border-blue-400"
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 flex items-center justify-center rounded-xl bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-500 border border-slate-600 hover:border-red-500/50 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL OVERLAY */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="animate-in fade-in zoom-in duration-200 bg-slate-900 border border-slate-700 rounded-[2.5rem] shadow-3xl w-full max-w-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {editingProduct ? <Pencil className="text-white/80" /> : <Plus className="text-white/80" />}
                  {editingProduct ? "Refinar Produto" : "Novo Item NexBuy"}
                </h2>
                <p className="text-blue-100/70 text-sm mt-1">Preencha as informações técnicas do produto abaixo.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Comercial</label>
                    <input
                      type="text"
                      placeholder="Ex: Teclado Mecânico RGB"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição Detalhada</label>
                    <textarea
                      placeholder="Características, dimensões e diferenciais..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-white resize-none"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 outline-none text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Qtd em Estoque</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 outline-none text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Imagem do Produto</label>
                    <div className="flex gap-4 items-center">
                      {formData.previewUrl && (
                        <img
                          src={formData.previewUrl}
                          className="w-24 h-24 object-cover rounded-2xl border-2 border-purple-500/50 shadow-lg shadow-purple-500/10"
                        />
                      )}
                      <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-4 cursor-pointer hover:bg-slate-800 transition-colors hover:border-orange-500 group">
                        <ImageIcon className="text-slate-500 group-hover:text-orange-500 mb-1" size={24} />
                        <span className="text-sm text-slate-400 font-medium">Trocar imagem</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 rounded-2xl text-slate-400 hover:text-white font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                  >
                    Salvar Produto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <footer className="relative z-10 py-12 text-center text-slate-600 text-sm">
        &copy; 2026 NexBuy System • Gestão de Inventário Premium
      </footer>
    </div>
  );
}