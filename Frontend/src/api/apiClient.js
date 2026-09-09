import axios from "axios";

const storageKey = "commercehub-auth";
export const currentHostname = () => window.location.hostname.toLowerCase();
export const platformDomain = () => (import.meta.env.VITE_PLATFORM_DOMAIN || "localhost").toLowerCase();
export const isPlatformHost = () => {
  const host = currentHostname();
  return host === platformDomain() || host === "127.0.0.1";
};
export const storedSession = () => {
  try { return JSON.parse(localStorage.getItem(storageKey) || "null"); } catch { return null; }
};
export const saveSession = (session) => localStorage.setItem(storageKey, JSON.stringify(session));
export const clearSession = () => localStorage.removeItem(storageKey);

const apiClient = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL,
    headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const session = storedSession();
  const publicAuthRequest = /\/auth\/(login|register|refresh|logout)$/.test(config.url || "");
  if (session?.accessToken && !publicAuthRequest) config.headers.Authorization = `Bearer ${session.accessToken}`;
  if (!isPlatformHost() && !config.skipTenantDomain) config.params = { ...(config.params || {}), domain: currentHostname() };
  return config;
});

let refreshPromise;
apiClient.interceptors.response.use((response) => response, async (error) => {
  const request = error.config;
  if (error.response?.status !== 401 || request?._retry || request?.url?.includes("/auth/refresh")) return Promise.reject(error);
  const session = storedSession();
  if (!session?.refreshToken) return Promise.reject(error);
  request._retry = true;
  try {
    refreshPromise ||= apiClient.post("/auth/refresh", { refreshToken: session.refreshToken }, { skipTenantDomain: true });
    const { data } = await refreshPromise;
    const next = data.data;
    saveSession({ ...session, ...next });
    request.headers.Authorization = `Bearer ${next.accessToken}`;
    return apiClient(request);
  } catch (refreshError) {
    clearSession(); window.dispatchEvent(new Event("commercehub:logout")); return Promise.reject(refreshError);
  } finally { refreshPromise = undefined; }
});

export default apiClient;
