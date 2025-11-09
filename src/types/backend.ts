// Corrected TypeScript types matching backend schema exactly

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string; // datetime
  updatedAt: string; // datetime
}

export interface TreeResponse {
  id: number;
  user_id: number;
  species: string; // oak, pine, birch, maple, elm, spruce
  latitude: number;
  longitude: number;
  location_name?: string;
  planting_date: string; // datetime
  health_score: number; // 0-100
  current_value: number;
  description?: string;
  created_at: string; // datetime
  updated_at: string; // datetime
}

export interface TreeListResponse {
  id: number;
  species: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  planting_date: string; // datetime
  health_score: number;
  current_value: number;
}

export interface TokenResponse {
  id: number;
  token_id: string;
  tree_id: number;
  owner_id: number;
  image_uri?: string;
  metadata_uri?: string;
  current_value: number;
  base_value: number;
  created_at: string; // datetime
  updated_at: string; // datetime
}

export interface TokenDetailResponse {
  id: number;
  token_id: string;
  tree_id: number;
  owner_id: number;
  image_uri?: string;
  metadata_uri?: string;
  current_value: number;
  base_value: number;
  tree: TreeResponse;
  created_at: string; // datetime
}

export interface HealthHistoryResponse {
  id: number;
  tree_id: number;
  health_score: number;
  token_value?: number;
  event_type?: string; // "growth", "drought", "pest", "recovery"
  description?: string;
  recorded_at: string; // datetime
}

export interface TradeResponse {
  id: number;
  token_id: number;
  user_id: number;
  trade_type: string; // "buy" or "sell"
  quantity: number;
  price_per_unit: number;
  total_value: number;
  created_at: string; // datetime
}

export interface PortfolioItem {
  tree: TreeListResponse;
  token?: TokenResponse;
  health_score: number;
  current_value: number;
}

export interface PortfolioResponse {
  user_id: number;
  total_trees: number;
  total_value: number;
  items: PortfolioItem[];
}

export interface MintTokenResponse {
  token_id: string;
  tree_id: number;
  image_uri: string;
  metadata_uri: string;
  message: string;
}

// Request schemas
export interface TreeCreateRequest {
  species: string; // oak, pine, birch, maple, elm, spruce
  latitude: number;
  longitude: number;
  location_name?: string;
  description?: string;
}

export interface HealthUpdateRequest {
  health_score: number;
  event_type?: string;
  description?: string;
}

export interface TradeCreateRequest {
  trade_type: string; // "buy" or "sell"
  quantity: number;
  price_per_unit: number;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

// Response types
export interface LoginResponse {
  access_token: string;
  token_type: string; // "bearer"
  user_id: number;
  username: string;
}

// Enum types (matching backend)
export enum TreeSpecies {
  OAK = "oak",
  PINE = "pine",
  BIRCH = "birch",
  MAPLE = "maple",
  ELM = "elm",
  SPRUCE = "spruce",
}

export enum TradeType {
  BUY = "buy",
  SELL = "sell",
}

export enum HealthEventType {
  GROWTH = "growth",
  DROUGHT = "drought",
  PEST = "pest",
  RECOVERY = "recovery",
}

// For internal state management (optional enhancements)
export interface TreeWithComputedFields extends TreeResponse {
  location: {
    latitude: number;
    longitude: number;
    label?: string;
  };
  age: number; // computed from planting_date
  ownerId: number; // alias for user_id
}
