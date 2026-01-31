import { FC, useState } from "react";
import { 
  X, Shield, Bell, Key, 
  ShoppingBag, Star, Smartphone,
  ChevronRight, Globe, ArrowLeft, Eye, EyeOff
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string) => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose, showToast }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    offers: false,
    security: true
  });

  if (!isOpen) return null;

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showToast(`${key === 'orders' ? 'Pedidos' : key === 'offers' ? 'Ofertas' : 'Segurança'} atualizado!`);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Senha atualizada com sucesso!");
    setIsChangingPassword(false);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] w-full max-w-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        
        {/* Header Elegante */}
        <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-4">
            {isChangingPassword && (
              <button onClick={() => setIsChangingPassword(false)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-all">
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-3xl font-black text-blue-950 tracking-tighter uppercase italic">
                {isChangingPassword ? "Nova Senha" : "Configurações"}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">NexBuy Control Center</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {isChangingPassword ? (
            /* FORMULÁRIO DE TROCA DE SENHA */
            <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-black text-blue-600 uppercase ml-4 mb-1 block">Senha Atual</label>
                  <input 
                    type={showPass ? "text" : "password"} 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Sua senha antiga"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="text-[10px] font-black text-blue-600 uppercase ml-4 mb-1 block">Nova Senha</label>
                    <input 
                      type={showPass ? "text" : "password"} 
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="Nova senha forte"
                      required
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black text-blue-600 uppercase ml-4 mb-1 block">Confirmar</label>
                    <input 
                      type={showPass ? "text" : "password"} 
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="Repita a senha"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />} {showPass ? "Ocultar" : "Mostrar"} Senhas
                </button>
              </div>

              <button className="w-full py-5 bg-blue-950 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-950/20 active:scale-95">
                Atualizar Credenciais
              </button>
            </form>
          ) : (
            /* CONTEÚDO ORIGINAL DO MODAL */
            <>
              {/* Central de Notificações */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 ml-2">
                  <Bell size={14} className="text-blue-600" />
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Notificações em Tempo Real</h4>
                </div>
                <div className="bg-gray-50/50 rounded-[2.5rem] p-2 border border-gray-100">
                  {[
                    { id: 'orders', label: 'Status de Pedidos', icon: ShoppingBag, color: 'text-blue-600' },
                    { id: 'offers', label: 'Ofertas e Promoções', icon: Star, color: 'text-orange-500' },
                    { id: 'security', label: 'Alertas de Acesso', icon: Shield, color: 'text-green-600' },
                  ].map((item, index) => (
                    <div key={item.id} className={`flex items-center justify-between p-5 ${index !== 2 ? 'border-b border-gray-100' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 bg-white rounded-xl shadow-sm ${item.color}`}>
                          <item.icon size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-700">{item.label}</span>
                          <span className="text-[10px] text-gray-400 font-medium">Receber alertas via App e E-mail</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                        className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${notifications[item.id as keyof typeof notifications] ? 'bg-orange-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${notifications[item.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Segurança da Conta */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 ml-2">
                  <Shield size={14} className="text-blue-600" />
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Segurança e Privacidade</h4>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                        <Key size={20} className="text-blue-600 group-hover:text-white" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-gray-700">Alterar Senha</span>
                        <span className="text-[10px] text-gray-400">Atualize sua credencial de acesso</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  <button className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                        <Smartphone size={20} className="text-blue-600 group-hover:text-white" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-gray-700">Dispositivos Conectados</span>
                        <span className="text-[10px] text-gray-400">Gerencie onde sua conta está aberta</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-10 py-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-2 opacity-40">
            <Globe size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Versão 1.0 - NexBuy Corp</span>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-orange-500 transition-colors">
            Privacidade & Termos
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;