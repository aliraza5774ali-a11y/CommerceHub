import apiClient from "./apiClient";

const data = (response) => response.data.data;

export const resolveTenant = async () =>
  data(await apiClient.get("/domains/resolve"));

export const api = {
  publicTheme: async () =>
    data(await apiClient.get("/settings/theme/public")),

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

  deleteProduct: async (id) =>
    data(await apiClient.delete(`/catalog/products/${id}`)),

  inventory: async (id) =>
    data(await apiClient.get(`/inventory/${id}`)),

  adjustInventory: async (id, input) =>
    data(await apiClient.post(`/inventory/${id}/adjust`, input)),

  inventoryList: async () =>
    data(await apiClient.get("/inventory")),

  productImages: async (productId) =>
    data(await apiClient.get(`/catalog/products/${productId}/images`)),

  addProductImage: async (productId, input) =>
    data(await apiClient.post(`/catalog/products/${productId}/images`, input)),

  deleteProductImage: async (imageId) =>
    data(await apiClient.delete(`/catalog/images/${imageId}`)),

  setPrimaryImage: async (imageId) =>
    data(await apiClient.patch(`/catalog/images/${imageId}/primary`)),

  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // Let axios/browser compute the multipart boundary itself — overriding
    // the instance's default "Content-Type: application/json" header here.
    return data(await apiClient.post("/media/upload", formData, { headers: { "Content-Type": undefined } }));
  },

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

  updateTheme: async (input) =>
    data(await apiClient.patch("/settings/theme", input)),

  layoutTemplates: async () =>
    data(await apiClient.get("/settings/layout-templates")),

  publicLayoutTemplate: async () =>
    data(await apiClient.get("/settings/template/public")),

  updateLayoutTemplate: async (input) =>
    data(await apiClient.patch("/settings/layout-template", input)),

  domains: async () =>
    data(await apiClient.get("/domains")),

  addDomain: async ({ host, domainType }) =>
    data(await apiClient.post("/domains", { host, domainType })),

  verifyDomain: async (id, token) =>
    data(await apiClient.post(`/domains/${id}/verify`, { token })),

  setPrimaryDomain: async (id) =>
    data(await apiClient.patch(`/domains/${id}/primary`)),

  deleteDomain: async (id) =>
    data(await apiClient.delete(`/domains/${id}`)),

  blogPosts: async () =>
    data(await apiClient.get("/blog/posts")),

  // ── CMS (storefront page/section editing — homepage, shop/about/contact/
  // blog hero banners, and the global footer) ───────────────────────────
  storefrontPage: async (slug) =>
    data(await apiClient.get(`/cms/storefront/${slug}`)),

  cmsPages: async () =>
    data(await apiClient.get("/cms/pages")),

  cmsPage: async (id) =>
    data(await apiClient.get(`/cms/pages/${id}`)),

  createCmsPage: async (input) =>
    data(await apiClient.post("/cms/pages", input)),

  updateCmsPage: async (id, input) =>
    data(await apiClient.patch(`/cms/pages/${id}`, input)),

  publishCmsPage: async (id) =>
    data(await apiClient.post(`/cms/pages/${id}/publish`)),

  unpublishCmsPage: async (id) =>
    data(await apiClient.post(`/cms/pages/${id}/unpublish`)),

  addCmsSection: async (pageId, input) =>
    data(await apiClient.post(`/cms/pages/${pageId}/sections`, input)),

  updateCmsSection: async (id, input) =>
    data(await apiClient.patch(`/cms/sections/${id}`, input)),

  deleteCmsSection: async (id) =>
    data(await apiClient.delete(`/cms/sections/${id}`)),

  reorderCmsSections: async (items) =>
    data(await apiClient.patch("/cms/sections/reorder", { items })),
};