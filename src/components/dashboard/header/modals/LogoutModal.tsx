import { FC } from "react";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleLogout: () => void;
}

const LogoutModal: FC<LogoutModalProps> = ({ isOpen, onClose, handleLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 animate-in zoom-in duration-300 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <LogOut size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Sair da conta?</h2>
        <p className="text-gray-500 mb-8 font-medium leading-relaxed text-sm px-4">
          Suas alterações salvas não serão perdidas ao encerrar esta sessão.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={handleLogout} className="w-full py-4 rounded-xl text-white bg-red-500 hover:bg-red-600 transition-all font-bold shadow-lg shadow-red-200 active:scale-95">
            Sim, encerrar sessão
          </button>
          <button onClick={onClose} className="w-full py-4 rounded-xl text-gray-400 hover:bg-gray-100 transition-all font-bold text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;