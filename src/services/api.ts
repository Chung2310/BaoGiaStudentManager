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
    // If token expired, try to refresh once
    if (response.status === 401 && data.code === "TOKEN_EXPIRED") {
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: "POST",
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.success && refreshData.data.accessToken) {
            setAccessToken(refreshData.data.accessToken);
            // Retry the original request
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

export const api = {
  // Auth
  async login(body: any) {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res.success && res.data.accessToken) {
      setAccessToken(res.data.accessToken);
    }
    return res.data;
  },

  async register(body: any) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getMe() {
    return request("/auth/me");
  },

  async logout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      setAccessToken(null);
    }
  },

  async checkSession() {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
      });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.success && refreshData.data.accessToken) {
          setAccessToken(refreshData.data.accessToken);
          return refreshData.data.user;
        }
      }
    } catch {
      console.log("No active session");
    }
    return null;
  },

  // Pricing
  async getPricing(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await request(`/pricing${query}`);
    return res.list;
  },

  async createPricing(body: any) {
    return request("/pricing", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async updatePricing(id: string, body: any) {
    return request(`/pricing/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async deletePricing(id: string) {
    return request(`/pricing/${id}`, {
      method: "DELETE",
    });
  },

  // Features
  async getFeatures(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await request(`/features${query}`);
    return res.list;
  },

  async createFeature(body: any) {
    return request("/features", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async updateFeature(id: string, body: any) {
    return request(`/features/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async deleteFeature(id: string) {
    return request(`/features/${id}`, {
      method: "DELETE",
    });
  },

  // Services
  async getServices(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await request(`/services${query}`);
    return res.list;
  },

  async createService(body: any) {
    return request("/services", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async updateService(id: string, body: any) {
    return request(`/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async deleteService(id: string) {
    return request(`/services/${id}`, {
      method: "DELETE",
    });
  },

  // Packages
  async getPackages(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await request(`/packages${query}`);
    return res.list;
  },

  async getAllPackages() {
    const res = await request("/packages/all");
    return res.data;
  },

  async createPackage(body: any) {
    return request("/packages", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async updatePackage(id: string, body: any) {
    return request(`/packages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async deletePackage(id: string) {
    return request(`/packages/${id}`, {
      method: "DELETE",
    });
  },
};
