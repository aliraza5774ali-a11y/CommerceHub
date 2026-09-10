import apiClient from "./apiClient";

const data = (response) => response.data.data;

export const resolveTenant = async () =>
  data(await apiClient.get("/domains/resolve"));

export const api = {
  publicProducts: async () =>
    data(await apiClient.get("/catalog/public/products")),

  publicProduct: async (slug) =>
    data(await apiClient.get(`/catalog/public/products/${slug}`)),

  products: async () =>
    data(await apiClient.get("/catalog/products")),

  createProduct: async (input) =>
    data(await apiClient.post("/catalog/products", input)),

  updateProduct: async (id, input) =>
    data(await apiClient.put(`/catalog/products/${id}`, input)),

  publishProduct: async (id) =>
    data(await apiClient.post(`/catalog/products/${id}/publish`)),

  inventory: async (id) =>
    data(await apiClient.get(`/inventory/${id}`)),

  adjustInventory: async (id, input) =>
    data(await apiClient.post(`/inventory/${id}/adjust`, input)),

  inventoryList: async () =>
    data(await apiClient.get("/inventory")),

  categories: async () =>
    data(await apiClient.get("/catalog/categories")),

  createCategory: async (input) =>
    data(await apiClient.post("/catalog/categories", input)),

  updateCategory: async (id, input) =>
    data(await apiClient.patch(`/catalog/categories/${id}`, input)),

  deleteCategory: async (id) =>
    data(await apiClient.delete(`/catalog/categories/${id}`)),

  warehouses: async () =>
    data(await apiClient.get("/inventory/warehouses")),

  createWarehouse: async (input) =>
    data(await apiClient.post("/inventory/warehouses", input)),

  updateWarehouse: async (id, input) =>
    data(await apiClient.patch(`/inventory/warehouses/${id}`, input)),

  deleteWarehouse: async (id) =>
    data(await apiClient.delete(`/inventory/warehouses/${id}`)),

  adminOrders: async () =>
    data(await apiClient.get("/admin/orders")),

  orders: async () =>
    data(await apiClient.get("/orders")),

  cart: async () =>
    data(await apiClient.get("/cart")),

  wishlist: async () =>
    data(await apiClient.get("/wishlist")),

  addWishlist: async (productId) =>
    data(await apiClient.post("/wishlist", { productId })),

  removeWishlist: async (productId) =>
    data(await apiClient.delete(`/wishlist/${productId}`)),

  customers: async () =>
    data(await apiClient.get("/customers")),

  overview: async () =>
    data(await apiClient.get("/analytics/overview")),

  settings: async () =>
    data(await apiClient.get("/settings")),

  domains: async () =>
    data(await apiClient.get("/domains")),

  blogPosts: async () =>
    data(await apiClient.get("/blog/posts")),
};
