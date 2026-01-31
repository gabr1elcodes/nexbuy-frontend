import { FC, useRef, useEffect, useState, ChangeEvent } from "react";
import { 
  X, Camera, ShieldCheck, Edit3, Save, 
  Loader2, ShoppingBag, Trophy, 
  Plus, Trash2, LayoutGrid, Heart, ArrowLeft
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  displayEmail: string;
  userInitials: string;
  userRole?: string;
  showToast: (message: string) => void;
}

const ProfileModal: FC<ProfileModalProps> = ({ 
  isOpen, onClose, userName, displayEmail, userInitials, userRole, showToast 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tempName, setTempName] = useState(userName);
  const [bio, setBio] = useState("Apaixonado por tecnologia e fã da NexBuy! 🚀");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [interests, setInterests] = useState(["Tecnologia", "Games", "Ofertas"]);
  const [newInterest, setNewInterest] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedImage = localStorage.getItem(`@nexbuy:profileImage:${displayEmail}`);
      const savedName = localStorage.getItem(`@nexbuy:userName:${displayEmail}`);
      const savedBio = localStorage.getItem(`@nexbuy:bio:${displayEmail}`);
      const savedInterests = localStorage.getItem(`@nexbuy:interests:${displayEmail}`);
      
      if (savedImage) setProfileImage(savedImage);
      if (savedName) setTempName(savedName);
      if (savedBio) setBio(savedBio);
      if (savedInterests) setInterests(JSON.parse(savedInterests));
    }
  }, [isOpen, displayEmail]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setHasChanges(true);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest("");
      setHasChanges(true);
    }
  };

  const handleSaveAll = () => {
    localStorage.setItem(`@nexbuy:profileImage:${displayEmail}`, profileImage || "");
    localStorage.setItem(`@nexbuy:userName:${displayEmail}`, tempName);
    localStorage.setItem(`@nexbuy:bio:${displayEmail}`, bio);
    localStorage.setItem(`@nexbuy:interests:${displayEmail}`, JSON.stringify(interests));
    setHasChanges(false);
    showToast("Perfil NexBuy atualizado! ✅");
  };

  const removeInterest = (tag: string) => {
    // 1. Filtra os interesses removendo a tag selecionada
    const updatedInterests = interests.filter(i => i !== tag);
    setInterests(updatedInterests);
    
    // 2. Marca que houve mudanças para ativar o botão Salvar
    setHasChanges(true);
    
    // 3. Dispara o Toast com uma mensagem personalizada
    showToast(`"${tag}" removido dos seus interesses.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      {/* Modal Container: Ajustado para Mobile */}
      <div className="relative bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl w-full max-w-4xl max-h-[92vh] md:max-h-[85vh] overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-700 flex flex-col md:flex-row">
        
        {/* LADO ESQUERDO: Identidade (Topo no Mobile) */}
        <div className="w-full md:w-80 bg-gradient-to-b from-blue-600 to-blue-800 p-6 md:p-10 flex flex-row md:flex-col items-center gap-6 md:gap-0 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full -mr-16 -mt-16 blur-3xl hidden md:block" />
          
          <div className="relative group flex-shrink-0">
            <div className="w-24 h-24 md:w-44 md:h-44 bg-white p-1 md:p-1.5 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="w-full h-full bg-blue-100 rounded-[1.6rem] md:rounded-[2rem] flex items-center justify-center text-blue-600 text-3xl md:text-5xl font-black overflow-hidden relative">
                {isUploading && <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}
                {profileImage ? <img src={profileImage} className="w-full h-full object-cover" /> : userInitials}
              </div>
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2 md:p-3.5 bg-orange-500 text-white rounded-xl md:rounded-2xl shadow-xl border-2 md:border-4 border-blue-600 hover:scale-110 transition-all">
              <Camera size={16} className="md:w-5 md:h-5" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>

          <div className="text-left md:text-center md:mt-8 flex-1">
            <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-tight">{tempName}</h2>
            <p className="text-blue-200 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">Membro NexBuy</p>
            
            {/* NexPoints Visíveis no Mobile ao lado da foto */}
            <div className="mt-3 md:mt-8 bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl flex items-center gap-3 border border-white/10 w-fit md:w-full mx-auto md:mx-0">
              <Trophy className="text-orange-400 w-4 h-4 md:w-6 md:h-6" />
              <div className="text-left">
                <p className="text-[8px] md:text-[10px] font-black uppercase text-blue-100 leading-none">NexPoints</p>
                <p className="text-sm md:text-xl font-black">2.450</p>
              </div>
            </div>
          </div>

          {/* Botão fechar mobile no topo direito */}
          <button onClick={onClose} className="absolute top-4 right-4 md:hidden p-2 bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* LADO DIREITO: Dashboard e Personalização */}
        <div className="flex-1 p-6 md:p-12 bg-gray-50/50 overflow-y-auto custom-scrollbar">
          <div className="hidden md:flex justify-between items-start mb-10">
            <div>
              <h3 className="text-2xl font-black text-blue-900 tracking-tight">Painel do Usuário</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Personalize sua experiência</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-all"><X size={24} /></button>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Seção Bio */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">
                <Edit3 size={14} /> Sobre Mim
              </label>
              <textarea 
                value={bio}
                onChange={(e) => { setBio(e.target.value); setHasChanges(true); }}
                className="w-full bg-white border border-gray-100 rounded-[1.5rem] md:rounded-3xl p-4 md:p-5 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm resize-none"
                rows={3}
                placeholder="Escreva algo sobre você..."
              />
            </div>

            {/* Seção Interesses */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">
                <Heart size={14} className="text-orange-500" /> Meus Interesses
              </label>
              <div className="flex flex-wrap gap-2">
                {interests.map((item) => (
                  <span key={item} className="px-3 md:px-4 py-1.5 md:py-2 bg-white border border-blue-50 text-blue-600 rounded-full text-[11px] font-black flex items-center gap-2 group shadow-sm">
                    {item}
                    <button onClick={() => removeInterest(item)} className="text-gray-300 hover:text-orange-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
                <div className="relative">
                  <input 
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                    placeholder="Novo..."
                    className="pl-4 pr-10 py-1.5 md:py-2 bg-blue-50 border border-blue-100 rounded-full text-[11px] font-bold outline-none w-24 md:w-32 focus:w-36 md:focus:w-40 transition-all"
                  />
                  <button onClick={addInterest} className="absolute right-1.5 top-1 md:top-1.5 p-1 bg-blue-600 text-white rounded-full hover:bg-orange-500 transition-colors">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid de Stats - 2 colunas no mobile também, mas com cards menores */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm group">
                <ShoppingBag className="text-blue-600 mb-2 w-5 h-5 md:w-6 md:h-6" size={24} />
                <p className="text-lg md:text-xl font-black text-gray-800">14</p>
                <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase">Compras</p>
              </div>
              <div className="bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm group">
                <LayoutGrid className="text-orange-500 mb-2 w-5 h-5 md:w-6 md:h-6" size={24} />
                <p className="text-lg md:text-xl font-black text-gray-800">5</p>
                <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase">Desejos</p>
              </div>
            </div>
          </div>

          {/* Rodapé de Ações: Stack vertical no mobile */}
          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><ShieldCheck size={18} /></div>
              <div>
                <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase leading-none">Verificado</p>
                <p className="text-[10px] md:text-[11px] font-bold text-gray-600 truncate max-w-[150px] md:max-w-none">{displayEmail}</p>
              </div>
            </div>
            
            {hasChanges && (
              <button onClick={handleSaveAll} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 md:py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <Save size={16} /> Salvar Alterações
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;