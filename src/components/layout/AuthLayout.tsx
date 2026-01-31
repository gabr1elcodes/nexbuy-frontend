import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#ededf5] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[550px]">
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 py-12 sm:px-12 lg:px-16">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/2 relative">
            <img
              src={`${API_URL}/login-direita.png`}
              alt="NexBuy Auth"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full rounded-[2rem] overflow-hidden shadow-xl h-32 sm:h-40 lg:h-48 border-4 border-white">
          <img
            src={`${API_URL}/login-footer.png`}
            alt="NexBuy Produtos"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
