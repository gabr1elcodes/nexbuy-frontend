import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    stock: string;
    file: File | null;
    previewUrl: string | null;
  }>({
    name: "",
    description: "",
    price: "",
    stock: "",
    file: null,
    previewUrl: null,
  });

  const getImageUrl = (image?: string) => {
    if (!image) return "https://via.placeholder.com/300x200?text=Sem+Imagem";
    if (image.startsWith("http") || image.startsWith("blob:")) return image;
    return `${API_URL}/uploads/${image}`;
  };

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

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);

      if (formData.file) {
        data.append("image", formData.file);
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        toast.success("Produto atualizado com sucesso");
      } else {
        await api.post("/products", data);
        toast.success("Produto criado com sucesso");
      }

      closeModal();
      loadProducts();
    } catch {
      toast.error("Erro ao salvar produto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Produto removido");
      loadProducts();
    } catch {
      toast.error("Erro ao deletar produto");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestão de Inventário
        </h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          + Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-20">
          Carregando produtos...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={getImageUrl(product.image)}
                className="w-full h-44 object-cover"
              />

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-lg text-gray-800 truncate">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between text-sm font-medium">
                  <span className="text-blue-600">
                    R$ {product.price}
                  </span>
                  <span
                    className={
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    Estoque: {product.stock}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h2>

            <input
              type="text"
              placeholder="Nome do produto"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded-xl p-3"
              required
            />

            <textarea
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded-xl p-3"
              rows={3}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Preço"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="border rounded-xl p-3"
                required
              />
              <input
                type="number"
                placeholder="Estoque"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="border rounded-xl p-3"
                required
              />
            </div>

            {formData.previewUrl && (
              <img
                src={formData.previewUrl}
                className="w-full h-40 object-cover rounded-xl"
              />
            )}

            <label className="block text-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-gray-50">
              Trocar imagem
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
