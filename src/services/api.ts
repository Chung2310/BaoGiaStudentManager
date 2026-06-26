const BASE_URL = "/api/v1";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

async function request(url: string, options: RequestInit = {}): Promise<any> {
  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text };
  }

  if (!response.ok) {
    if (response.status === 401 && data.code === "TOKEN_EXPIRED") {
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, { method: "POST" });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.success && refreshData.data.accessToken) {
            setAccessToken(refreshData.data.accessToken);
            return request(url, options);
          }
        }
      } catch {
        console.error("Token refresh failed");
      }
    }
    throw new Error(data.error || "Có lỗi xảy ra");
  }

  return data;
}

function buildQuery(params: Record<string, string | undefined>): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) p.set(k, v); });
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const api = {
  // Auth
  async login(body: any) {
    const res = await request("/auth/login", { method: "POST", body: JSON.stringify(body) });
    if (res.success && res.data.accessToken) setAccessToken(res.data.accessToken);
    return res.data;
  },

  async register(body: any) {
    return request("/auth/register", { method: "POST", body: JSON.stringify(body) });
  },

  async getMe() {
    return request("/auth/me");
  },

  async logout() {
    try { await request("/auth/logout", { method: "POST" }); } finally { setAccessToken(null); }
  },

  async checkSession() {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, { method: "POST" });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.success && refreshData.data.accessToken) {
          setAccessToken(refreshData.data.accessToken);
          return refreshData.data.user;
        }
      }
    } catch { console.log("No active session"); }
    return null;
  },

  // Projects
  async getProjects() {
    const res = await request("/projects");
    return res.data;
  },

  async createProject(body: { name: string; description?: string }) {
    const res = await request("/projects", { method: "POST", body: JSON.stringify(body) });
    return res.data;
  },

  async updateProject(id: string, body: { name?: string; description?: string }) {
    const res = await request(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(body) });
    return res.data;
  },

  async deleteProject(id: string) {
    return request(`/projects/${id}`, { method: "DELETE" });
  },

  async cloneProject(id: string, name: string) {
    const res = await request(`/projects/${id}/clone`, { method: "POST", body: JSON.stringify({ name }) });
    return res.data;
  },

  // Pricing
  async getPricing(search?: string, projectId?: string) {
    const res = await request(`/pricing${buildQuery({ search, projectId })}`);
    return res.list;
  },

  async createPricing(body: any) {
    return request("/pricing", { method: "POST", body: JSON.stringify(body) });
  },

  async updatePricing(id: string, body: any) {
    return request(`/pricing/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  async deletePricing(id: string) {
    return request(`/pricing/${id}`, { method: "DELETE" });
  },

  // Features
  async getFeatures(search?: string, projectId?: string) {
    const res = await request(`/features${buildQuery({ search, projectId })}`);
    return res.list;
  },

  async createFeature(body: any) {
    return request("/features", { method: "POST", body: JSON.stringify(body) });
  },

  async updateFeature(id: string, body: any) {
    return request(`/features/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  async deleteFeature(id: string) {
    return request(`/features/${id}`, { method: "DELETE" });
  },

  // Services
  async getServices(search?: string, projectId?: string) {
    const res = await request(`/services${buildQuery({ search, projectId })}`);
    return res.list;
  },

  async createService(body: any) {
    return request("/services", { method: "POST", body: JSON.stringify(body) });
  },

  async updateService(id: string, body: any) {
    return request(`/services/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  async deleteService(id: string) {
    return request(`/services/${id}`, { method: "DELETE" });
  },

  // Packages
  async getPackages(search?: string, projectId?: string) {
    const res = await request(`/packages${buildQuery({ search, projectId })}`);
    return res.list;
  },

  async getAllPackages(projectId?: string) {
    const res = await request(`/packages/all${buildQuery({ projectId })}`);
    return res.data;
  },

  async createPackage(body: any) {
    return request("/packages", { method: "POST", body: JSON.stringify(body) });
  },

  async updatePackage(id: string, body: any) {
    return request(`/packages/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  async deletePackage(id: string) {
    return request(`/packages/${id}`, { method: "DELETE" });
  },

  // Settings
  async getSettings(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await request(`/settings${query}`);
    return res.list;
  },

  async getSettingByKey(key: string) {
    const res = await request(`/settings/key/${key}`);
    return res.data;
  },

  async createSetting(body: any) {
    return request("/settings", { method: "POST", body: JSON.stringify(body) });
  },

  async updateSetting(id: string, body: any) {
    return request(`/settings/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  async deleteSetting(id: string) {
    return request(`/settings/${id}`, { method: "DELETE" });
  },

  async upsertSetting(key: string, value: string) {
    try {
      const existing = await request(`/settings/key/${key}`);
      if (existing?.data?._id) {
        return request(`/settings/${existing.data._id}`, { method: "PATCH", body: JSON.stringify({ value }) });
      }
    } catch {
      // key not found, create
    }
    return request("/settings", { method: "POST", body: JSON.stringify({ key, value }) });
  },
};
