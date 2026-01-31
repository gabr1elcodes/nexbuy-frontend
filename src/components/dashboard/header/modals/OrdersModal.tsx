import { FC, useEffect, useState } from "react";
import { X, ShoppingBag, Clock, ChevronRight, Loader2 } from "lucide-react";
import api from "../../../../services/api";

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const OrdersModal: FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path?: string) => {
    if (!path || path.trim() === "")
      return "https://via.placeholder.com/150?text=Sem+Foto";
    if (path.startsWith("http")) return path;
    let cleanPath = path.replace(/\\/g, "/").trim();
    if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
    const finalPath = cleanPath.startsWith("uploads/")
      ? cleanPath
      : `uploads/${cleanPath}`;
    return `${API_URL}/${finalPath}`;
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const orders = [
    {
      id: "NB-2026-001",
      date: "24 Jan, 2026",
      status: "Entregue",
      total: 4799.98,
      items: [
        {
          name: "Smart TV 55' Ultra HD 4K",
          price: 2999.99,
          image: "uploads/televisaoGeminiNex.png",
        },
        {
          name: "Smartphone Pro Max",
          price: 1799.99,
          image: "uploads/CelularGeminiNex.png",
        },
      ],
    },
    {
      id: "NB-2026-002",
      date: "20 Jan, 2026",
      status: "Em Trânsito",
      total: 599.99,
      items: [
        {
          name: "Headset Premium Pro Sound",
          price: 599.99,
          image: "uploads/headsetGeminiNex.png",
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
        <div className="px-8 py-7 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                Minhas Compras
              </h2>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">
                NexBuy Marketplace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-gray-50/30">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="font-bold text-sm tracking-widest uppercase">
                Carregando...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-black text-gray-800 uppercase tracking-tighter">
                        Pedido #{order.id}
                      </span>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.status === "Entregue"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-50"
                      >
                        <div className="h-16 w-16 rounded-xl bg-white overflow-hidden border border-gray-200 flex-shrink-0">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="h-full w-full object-contain"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://via.placeholder.com/150?text=NexBuy")
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs font-black text-blue-600">
                            {Number(item.price).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={14} />
                      <span className="text-xs font-bold">{order.date}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400 uppercase">
                        Total pago
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        {order.total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-center">
          <button className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
            Precisa de ajuda com uma compra? <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
