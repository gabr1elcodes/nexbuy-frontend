import api from '../api';

// E-mail que terá as ações simuladas
const GUEST_EMAIL = "visitante@nexbuy.com";

// Função auxiliar para verificar se é o visitante e simular o delay
const isGuestAndSimulate = async (): Promise<boolean> => {
  const storedUser = localStorage.getItem("@nexbuy:user");
  if (storedUser) {
    const { email } = JSON.parse(storedUser);
    if (email === GUEST_EMAIL) {
      // Simula um delay de 800ms para parecer uma requisição real
      await new Promise((resolve) => setTimeout(resolve, 800));
      return true;
    }
  }
  return false;
};

export const getAllProducts = async () => {
  const res = await api.get('/products');
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data: FormData) => {
  if (await isGuestAndSimulate()) {
    return { message: "Modo Demo: Produto simulado com sucesso!" };
  }

  const res = await api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateProduct = async (id: string, data: FormData) => {
  if (await isGuestAndSimulate()) {
    return { message: "Modo Demo: Alteração simulada com sucesso!" };
  }

  const res = await api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteProduct = async (id: string) => {
  if (await isGuestAndSimulate()) {
    return { message: "Modo Demo: Exclusão simulada com sucesso!" };
  }

  const res = await api.delete(`/products/${id}`);
  return res.data;
};