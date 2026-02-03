import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  FC,
  useContext,
} from "react";
import { login as loginService } from "../services/auth/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "visitor";
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (data: LoginResponse) => void;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    if (email === "visitante@nexbuy.com") {
      const visitorUser: User = {
        id: "visitor",
        name: "Visitante",
        email: "visitante@nexbuy.com",
        role: "visitor",
      };

      localStorage.setItem("@nexbuy:token", "visitor-token");
      localStorage.setItem("@nexbuy:user", JSON.stringify(visitorUser));

      setUser(visitorUser);
      return;
    }

    // 🔹 LOGIN NORMAL
    const data = await loginService({ email, password });

    localStorage.setItem("@nexbuy:token", data.token);
    localStorage.setItem("@nexbuy:user", JSON.stringify(data.user));

    setUser(data.user);
  };

  const signInWithGoogle = (data: LoginResponse) => {
    localStorage.setItem("@nexbuy:token", data.token);
    localStorage.setItem("@nexbuy:user", JSON.stringify(data.user));

    setUser(data.user);
  };

  const signOut = () => {
    localStorage.removeItem("@nexbuy:token");
    localStorage.removeItem("@nexbuy:user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("@nexbuy:token");
    const storedUser = localStorage.getItem("@nexbuy:user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
