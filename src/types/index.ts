export type Tree = {
  id: string;
  ownerId: string;
  ownerName: string;
  species: string;
  nickname?: string;
  location?: { lat?: number; lng?: number; label?: string };
  plantedAt: string;
  lastWateredAt?: string;
  healthIndex: number; // 0-100
  ndvi?: number;
  photos: TreePhoto[];
  careIndex: number;
  stewardshipScore: number;
  tokenId?: string;
  listed?: boolean;
  price?: number;
  characteristics?: {
    size?: string;
    light?: string;
    soilType?: string;
  };
};

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

export type User = {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
};

export type Badge = {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
};
