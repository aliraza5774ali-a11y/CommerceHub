import apiClient, { clearSession, saveSession } from "./apiClient";
const body = (response) => response.data.data;
export const register = async (input) => body(await apiClient.post("/auth/register", input));
export const login = async (input) => body(await apiClient.post("/auth/login", input));
export const selectBusiness = async (input) => body(await apiClient.post("/auth/select-business", input));
export const verifyTwoFactor = async (input) => body(await apiClient.post("/auth/verify-2fa", input));
export const enableTwoFactor = async () => body(await apiClient.post("/auth/2fa/enable"));
export const disableTwoFactor = async () => body(await apiClient.post("/auth/2fa/disable"));
export const themeOptions = async () => body(await apiClient.get("/auth/theme-options"));
export const me = async () => body(await apiClient.get("/auth/me"));
export const logout = async () => {
  const session = JSON.parse(localStorage.getItem("commercehub-auth") || "null");
  try { if (session?.refreshToken) await apiClient.post("/auth/logout", { refreshToken: session.refreshToken }, { skipTenantDomain: true }); }
  finally { clearSession(); }
};
export const persistSession = (payload) => saveSession(payload);
