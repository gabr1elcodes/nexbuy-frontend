import { useEffect, useState, useReducer, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus, AiOutlineLoading3Quarters, AiOutlineArrowLeft } from "react-icons/ai";
import { BsTag, BsCardImage } from "react-icons/bs";
import { BiDollar } from "react-icons/bi";
import { FiPackage, FiSearch } from "react-icons/fi";
import { TbFileText } from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";

import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../products/products.service";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:3333";

interface Product {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
  description?: string;
  image?: string;
}

interface FormState {
  name: string;
  price: string;
  oldPrice: string;
  stock: string;
  description: string;
  file: File | null;
  previewUrl: string | null;
}

const THEME = {
  primary: "bg-blue-600 hover:bg-blue-700",
  success: "bg-emerald-500 hover:bg-emerald-600",
  danger: "bg-rose-500 hover:bg-rose-600",
  input: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
};

export default function Products() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVisitor = user?.email === "visitante@nexbuy.com";

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const initialFormState: FormState = {
    name: "",
    price: "",
    oldPrice: "",
    stock: "",
    description: "",
    file: null,
    previewUrl: null,
  };

  const [formData, setFormData] = useReducer(
    (state: FormState, newState: Partial<FormState>) => ({ ...state, ...newState }),
    initialFormState
  );

  const getImageUrl = (path?: string) => {
    if (!path || path.trim() === "") return "https://via.placeholder.com/150?text=Sem+Foto";
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/\\/g, '/').trim();
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
    return `${API_URL}/${finalPath}`;
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      let actualData: Product[] = [];
      if (Array.isArray(res)) {
        actualData = res;
      } else if (res && typeof res === 'object' && Array.isArray((res as any).data)) {
        actualData = (res as any).data;
      }
      setProducts(actualData);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => 
      p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleOpenModal = (type: "create" | "edit" | "delete", product?: Product) => {
    setModalType(type);
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: String(product.price),
        oldPrice: product.oldPrice && Number(product.oldPrice) > 0 ? String(product.oldPrice) : "",
        stock: String(product.stock),
        description: product.description || "",
        file: null,
        previewUrl: getImageUrl(product.image),
      });
    } else {
      setFormData(initialFormState);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSubmitting(false);
    setEditingProduct(null);
    if (formData.previewUrl && !formData.previewUrl.startsWith('http')) {
        URL.revokeObjectURL(formData.previewUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData({ file, previewUrl: URL.createObjectURL(file) });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVisitor) return toast.error("Acesso de visitante: não é possível salvar.");
    if (!formData.name || Number(formData.price) <= 0) return toast.error("Preencha os campos obrigatórios.");

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", formData.price);
      payload.append("stock", formData.stock);
      payload.append("description", formData.description);
      
      // LÓGICA DE CORREÇÃO: Envia "0" se o campo estiver vazio para resetar no banco
      const oldPriceValue = (formData.oldPrice && formData.oldPrice.trim() !== "") 
        ? formData.oldPrice 
        : "0"; 
      payload.append("oldPrice", oldPriceValue);

      if (formData.file) payload.append("image", formData.file);

      if (modalType === "edit" && editingProduct) {
        await updateProduct(editingProduct._id, payload as any);
        toast.success("Produto atualizado!");
      } else {
        await createProduct(payload as any);
        toast.success("Produto cadastrado!");
      }
      
      await fetchProducts(); 
      handleCloseModal();
    } catch (error: any) {
      // Log para diagnóstico se o erro persistir
      console.error("Erro detalhado da API:", error.response?.data || error);
      const errorMsg = error.response?.data?.message || "Erro ao salvar o produto.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isVisitor) return toast.error("Acesso de visitante: não é possível excluir.");
    if (!editingProduct) return;
    setSubmitting(true);
    try {
      await deleteProduct(editingProduct._id);
      toast.success("Produto removido!");
      await fetchProducts();
      handleCloseModal();
    } catch (error) {
      toast.error("Erro ao excluir produto.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => navigate("/dashboard")} className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition-colors text-gray-600">
            <AiOutlineArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Gestão de Inventário</h1>
            <p className="text-gray-500">Controle total dos seus produtos.</p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Buscar..." className={THEME.input} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => handleOpenModal("create")} className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95 ${isVisitor ? 'bg-gray-400 cursor-not-allowed' : THEME.success}`}>
            <AiOutlinePlus size={20} /> Adicionar
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
            <AiOutlineLoading3Quarters className="animate-spin mb-4" size={40} />
            <p>Carregando catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-20 text-center text-gray-400">
            <FiSearch size={48} className="mx-auto mb-4 opacity-20" />
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                           <img src={getImageUrl(product.image)} alt={product.name} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=Erro")} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">R$ {Number(product.price || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        {product.oldPrice && Number(product.oldPrice) > 0 ? (
                            <span className="text-xs text-gray-400 line-through">R$ {Number(product.oldPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${Number(product.stock) > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {Number(product.stock) > 0 ? `${product.stock} em estoque` : "Esgotado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal("edit", product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><AiOutlineEdit size={20} /></button>
                        <button onClick={() => handleOpenModal("delete", product)} className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"><AiOutlineDelete size={20} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{modalType === "delete" ? "Confirmar Exclusão" : modalType === "edit" ? "Editar Produto" : "Novo Produto"}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              {modalType === "delete" ? (
                <div className="space-y-4">
                  <p className="text-gray-600">Deseja remover <strong>{editingProduct?.name}</strong>?</p>
                  <div className="flex justify-end gap-3">
                    <button onClick={handleCloseModal} className="px-5 py-2 text-gray-600">Cancelar</button>
                    <button onClick={handleDelete} disabled={submitting || isVisitor} className={`px-6 py-2 rounded-lg text-white font-semibold flex items-center gap-2 ${isVisitor ? 'bg-gray-400' : THEME.danger} disabled:opacity-50`}>
                      {submitting && <AiOutlineLoading3Quarters className="animate-spin" />} {isVisitor ? "Apenas Leitura" : "Confirmar"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="flex justify-center mb-4"><div className="h-32 w-32 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                    {formData.previewUrl ? <img src={formData.previewUrl} alt="Preview" className="h-full w-full object-cover" /> : <BsCardImage size={40} className="text-gray-300" />}
                  </div></div>
                  <div className="relative"><BsTag className="absolute left-3 top-3 text-gray-400" /><input required className={THEME.input} placeholder="Nome" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative"><BiDollar className="absolute left-3 top-3 text-gray-400" /><input required type="number" step="0.01" className={THEME.input} placeholder="Preço" value={formData.price} onChange={(e) => setFormData({ price: e.target.value })} /></div>
                    <div className="relative"><BiDollar className="absolute left-3 top-3 text-orange-400" /><input type="number" step="0.01" className={`${THEME.input} border-orange-100 focus:ring-orange-200`} placeholder="Preço Antigo (Opcional)" value={formData.oldPrice} onChange={(e) => setFormData({ oldPrice: e.target.value })} /></div>
                  </div>
                  <div className="relative"><FiPackage className="absolute left-3 top-3 text-gray-400" /><input required type="number" className={THEME.input} placeholder="Estoque" value={formData.stock} onChange={(e) => setFormData({ stock: e.target.value })} /></div>
                  <div className="relative"><TbFileText className="absolute left-3 top-3 text-gray-400" /><textarea rows={3} className={`${THEME.input} min-h-[80px]`} placeholder="Descrição..." value={formData.description} onChange={(e) => setFormData({ description: e.target.value })} /></div>
                  <div className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${isVisitor ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-200 hover:border-blue-400'}`}>
                    <input type="file" disabled={isVisitor} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    <div className="flex items-center gap-3 text-gray-500"><BsCardImage size={24} /><span className="text-sm truncate max-w-[200px]">{formData.file ? formData.file.name : "Trocar Imagem"}</span></div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={handleCloseModal} className="px-5 py-2 text-gray-600">Cancelar</button>
                    <button type="submit" disabled={submitting || isVisitor} className={`px-8 py-2 rounded-lg text-white font-semibold flex items-center gap-2 ${isVisitor ? 'bg-gray-400' : THEME.primary} disabled:opacity-50 shadow-md`}>
                      {submitting && <AiOutlineLoading3Quarters className="animate-spin" />}{isVisitor ? "Apenas Leitura" : (modalType === "edit" ? "Atualizar" : "Salvar")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}