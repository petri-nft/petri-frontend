// API client for communicating with FastAPI backend
const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Load token from localStorage if available
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Get token from instance or localStorage as fallback
    const token = this.token || localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - token expired
    if (response.status === 401) {
      // Clear the expired token
      this.setToken(null);
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      throw new Error('Your session has expired. Please log in again.');
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, username: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  }

  async login(username: string, password: string) {
    const response = await this.request<{ access_token: string; user: any }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
    this.setToken(response.access_token);
    return response;
  }

  // Tree endpoints
  async getTrees() {
    return this.request('/trees', { method: 'GET' });
  }

  async getTree(id: string) {
    return this.request(`/trees/${id}`, { method: 'GET' });
  }

  async plantTree(data: {
    species: string;
    latitude: number;
    longitude: number;
    nickname: string;
    photo_url?: string;
    location_name?: string;
    description?: string;
  }) {
    return this.request('/trees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTreeHealth(id: string, data: {
    health_score: number;
    event_type?: string;
    description?: string;
  }) {
    return this.request(`/trees/${id}/updateHealth`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTreeHealthHistory(id: string) {
    return this.request(`/trees/${id}/health-history`, { method: 'GET' });
  }

  // Token/NFT endpoints
  async mintToken(treeId: string) {
    return this.request(`/trees/${treeId}/mint`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async getNFTToken(tokenId: string) {
    return this.request(`/tokens/${tokenId}`, { method: 'GET' });
  }

  async getNFTTokens() {
    return this.request('/tokens', { method: 'GET' });
  }

  // Trade endpoints
  async createTrade(tokenId: string, data: {
    trade_type: 'buy' | 'sell';
    quantity: number;
    price_per_unit: number;
  }) {
    return this.request(`/tokens/${tokenId}/trade`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTokenTrades(tokenId: string) {
    return this.request(`/tokens/${tokenId}/trades`, { method: 'GET' });
  }

  // Portfolio endpoint
  async getPortfolio() {
    return this.request('/portfolio/me', { method: 'GET' });
  }

  // Health check
  async healthCheck() {
    return this.request('/health', { method: 'GET' });
  }

  // ==================== AI Personality & Chat Endpoints ====================

  async setTreePersonality(treeId: string, data: {
    name: string;
    tone: string;
    background: string;
    traits?: Record<string, string | number | boolean>;
  }) {
    return this.request(`/trees/${treeId}/personality`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTreePersonality(treeId: string) {
    return this.request(`/trees/${treeId}/personality`, { method: 'GET' });
  }

  async chatWithTree(treeId: string, data: {
    content: string;
    include_audio?: boolean;
  }) {
    return this.request(`/trees/${treeId}/chat`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTreeChatHistory(treeId: string, limit: number = 20) {
    return this.request(`/trees/${treeId}/chat-history?limit=${limit}`, {
      method: 'GET',
    });
  }

  async setTreePublic(treeId: string, isPublic: boolean) {
    return this.request(`/trees/${treeId}/set-public`, {
      method: 'POST',
      body: JSON.stringify({ is_public: isPublic }),
    });
  }

  async getPublicTrees(limit: number = 20, offset: number = 0) {
    return this.request(`/trees/marketplace/trees?limit=${limit}&offset=${offset}`, {
      method: 'GET',
    });
  }

  async getAvailableVoices() {
    return this.request('/trees/voices', { method: 'GET' });
  }
}

export const apiClient = new ApiClient();
