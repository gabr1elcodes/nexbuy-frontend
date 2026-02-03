import { FC, useState } from "react";
import ProfileModal from "./modals/ProfileModal";
import LogoutModal from "./modals/LogoutModal";
import OrdersModal from "./modals/OrdersModal";
import SettingsModal from "./modals/SettingsModal";
import { Check } from "lucide-react";

interface DashboardModaisProps {
  openProfile: boolean;
  setOpenProfile: (open: boolean) => void;
  openLogout: boolean;
  setOpenLogout: (open: boolean) => void;
  openOrders: boolean;
  setOpenOrders: (open: boolean) => void;
  openSettings: boolean; 
  setOpenSettings: (open: boolean) => void;

  handleLogout: () => void;
  userInitials: string;
  displayEmail: string;
  userName: string;
  userRole?: string;
}

const DashboardModais: FC<DashboardModaisProps> = (props) => {
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>

      {toast?.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-10 duration-300">
          <div className="bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <div className="bg-green-500 rounded-full p-1"><Check size={14} /></div>
            <span className="text-sm font-bold tracking-tight">{toast.message}</span>
          </div>
        </div>
      )}


      <ProfileModal 
        isOpen={props.openProfile} 
        onClose={() => props.setOpenProfile(false)} 
        showToast={showToast}
        userName={props.userName}
        displayEmail={props.displayEmail}
        userInitials={props.userInitials}
        userRole={props.userRole}
      />
      
      <LogoutModal 
        isOpen={props.openLogout} 
        onClose={() => props.setOpenLogout(false)} 
        handleLogout={props.handleLogout}
      />

      <OrdersModal 
        isOpen={props.openOrders} 
        onClose={() => props.setOpenOrders(false)} 
      />


      <SettingsModal
        isOpen={props.openSettings}
        onClose={() => props.setOpenSettings(false)}
        showToast={showToast}
      />
    </>
  );
};

export default DashboardModais;