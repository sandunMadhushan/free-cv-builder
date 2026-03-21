// API service for communicating with the CV Builder backend

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // CV Management
  async saveCV(cvData) {
    return this.request("/cv", {
      method: "POST",
      body: JSON.stringify(cvData),
    });
  }

  async getCV(id) {
    return this.request(`/cv/${id}`);
  }

  async updateCV(id, cvData) {
    return this.request(`/cv/${id}`, {
      method: "PUT",
      body: JSON.stringify(cvData),
    });
  }

  async deleteCV(id) {
    return this.request(`/cv/${id}`, {
      method: "DELETE",
    });
  }

  // Sharing
  async makePublic(id) {
    return this.request(`/cv/${id}/public`, {
      method: "POST",
    });
  }

  async makePrivate(id) {
    return this.request(`/cv/${id}/private`, {
      method: "POST",
    });
  }

  async getSharedCV(shareId) {
    return this.request(`/share/${shareId}`);
  }

  async getCVAnalytics(id) {
    return this.request(`/cv/${id}/analytics`);
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(
        `${this.baseURL.replace("/api", "")}/health`,
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new APIService();
