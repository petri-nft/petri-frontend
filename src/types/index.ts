// ============== Backend API Types (from /types/backend.ts) ==============
export type User = {
  id: string | number;
  username?: string;
  email?: string;
  displayName?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Tree = {
  // Backend fields
  id: string | number;
  user_id?: number;
  species: string; // oak, pine, birch, maple, elm, spruce
  latitude?: number;
  longitude?: number;
  location_name?: string;
  planting_date?: string;
  health_score?: number; // 0-100
  current_value?: number;
  description?: string;
  photo_url?: string; // URL to captured photo
  nft_image_url?: string; // URL to generated NFT image
  created_at?: string;
  updated_at?: string;
  
  // Frontend/Mock data fields
  ownerId?: string | number;
  ownerName?: string;
  nickname?: string;
  location?: { label: string };
  plantedAt?: string;
  lastWateredAt?: string;
  healthIndex?: number;
  ndvi?: number;
  photos?: TreePhoto[];
  careIndex?: number;
  stewardshipScore?: number;
  tokenId?: string;
  characteristics?: {
    size?: string;
    light?: string;
    soilType?: string;
  };
  listed?: boolean;
  price?: number;
};

export type TreeList = {
  id: number;
  species: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  planting_date: string;
  health_score: number;
  current_value: number;
};

export type Token = {
  id: number;
  token_id: string;
  tree_id: number;
  owner_id: number;
  image_uri?: string;
  metadata_uri?: string;
  current_value: number;
  base_value: number;
  created_at: string;
  updated_at: string;
};

export type TokenDetail = {
  id: number;
  token_id: string;
  tree_id: number;
  owner_id: number;
  image_uri?: string;
  metadata_uri?: string;
  current_value: number;
  base_value: number;
  tree: Tree;
  created_at: string;
};

export type HealthHistory = {
  id: number;
  tree_id: number;
  health_score: number;
  token_value?: number;
  event_type?: string; // "growth", "drought", "pest", "recovery"
  description?: string;
  recorded_at: string;
};

export type Trade = {
  id: number;
  token_id: number;
  user_id: number;
  trade_type: string; // "buy" or "sell"
  quantity: number;
  price_per_unit: number;
  total_value: number;
  created_at: string;
};

export type PortfolioItem = {
  tree: TreeList;
  token?: Token;
  health_score: number;
  current_value: number;
};

export type Portfolio = {
  user_id: number;
  total_trees: number;
  total_value: number;
  items: PortfolioItem[];
};

// ============== Feature Types (Frontend-specific enhancements) ==============

export type TreePhoto = {
  id: string;
  url: string;
  takenAt: string;
  note?: string;
};

export type Lesson = {
  id: string;
  title: string;
  speciesTag?: string;
  seasonTag?: string;
  summary: string;
  steps: string[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
};

export type ChatMessage = {
  id: string;
  from: 'user' | 'sage';
  text: string;
  createdAt: string;
  attachmentUrl?: string;
};

export type Badge = {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
};

// ============== AI Personality & Chat Types ==============

export type TreePersonality = {
  id: number;
  tree_id: number;
  name: string; // e.g., "Wise Oak", "Cheeky Pine"
  tone: string; // "humorous", "wise", "educational", "poetic", "sarcastic"
  background: string; // Tree's backstory
  traits: Record<string, string | number | boolean>;
  voice_id?: string; // ElevenLabs voice ID
  created_at: string;
  updated_at: string;
};

export type ChatMessage_AI = {
  id: number;
  tree_id: number;
  user_id: number;
  role: 'user' | 'assistant';
  content: string;
  audio_url?: string; // ElevenLabs generated speech
  created_at: string;
};

export type TreeInteraction = {
  user_message: string;
  tree_response: string;
  audio_url?: string;
  tree_name: string;
  tree_personality: TreePersonality;
};

export type ElevenLabsVoice = {
  name: string;
  voice_id: string;
  description: string;
};

export type PublicTree = {
  id: number;
  species: string;
  location_name?: string;
  health_score: number;
  current_value: number;
  owner: string;
  personality?: {
    name: string;
    tone: string;
  };
  created_at: string;
};

