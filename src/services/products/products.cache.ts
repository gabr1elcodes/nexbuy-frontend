let productsCache: any[] | null = null;

export const getCachedProducts = () => productsCache;

export const setCachedProducts = (products: any[]) => {
  productsCache = products;
};

export const clearProductsCache = () => {
  productsCache = null;
};