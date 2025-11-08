import { create } from 'zustand';
import { Tree, User, ChatMessage, Lesson } from '@/types';
import { mockTrees, mockUser, mockLessons } from '@/lib/mockData';

interface AppState {
  user: User | null;
  token: string | null;
  trees: Tree[];
  chatMessages: ChatMessage[];
  currentTreeId: string | null;
  
  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Tree actions
  setTrees: (trees: Tree[]) => void;
  addTree: (tree: Tree) => void;
  updateTree: (treeId: string, updates: Partial<Tree>) => void;
  deleteTree: (treeId: string) => void;
  
  // Chat actions
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  
  // Lesson actions
  completeLesson: (treeId: string, lessonId: string) => void;
  
  // Water action
  waterTree: (treeId: string) => void;
  
  // Market actions
  listTreeForSale: (treeId: string, price: number) => void;
  unlistTree: (treeId: string) => void;
  buyTree: (treeId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  token: null,
  trees: [],
  chatMessages: [],
  currentTreeId: null,

  login: async (email: string, password: string) => {
    // Mock login
    if (email === 'demo@tree.shares' && password === 'demo123') {
      set({ user: mockUser, token: 'mock-jwt-token', trees: mockTrees });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  register: async (email: string, password: string, displayName: string) => {
    // Mock registration
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      displayName,
      createdAt: new Date().toISOString(),
    };
    set({ user: newUser, token: 'mock-jwt-token', trees: [] });
    return { success: true };
  },

  logout: () => {
    set({ user: null, token: null, trees: [], chatMessages: [] });
  },

  setTrees: (trees) => set({ trees }),

  addTree: (tree) => set((state) => ({ trees: [...state.trees, tree] })),

  updateTree: (treeId, updates) =>
    set((state) => ({
      trees: state.trees.map((tree) =>
        tree.id === treeId ? { ...tree, ...updates } : tree
      ),
    })),

  deleteTree: (treeId) =>
    set((state) => ({
      trees: state.trees.filter((tree) => tree.id !== treeId),
    })),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  setChatMessages: (messages) => set({ chatMessages: messages }),

  completeLesson: (treeId, lessonId) =>
    set((state) => ({
      trees: state.trees.map((tree) =>
        tree.id === treeId
          ? {
              ...tree,
              stewardshipScore: tree.stewardshipScore + 5,
              careIndex: tree.careIndex + 3,
            }
          : tree
      ),
    })),

  waterTree: (treeId) =>
    set((state) => ({
      trees: state.trees.map((tree) =>
        tree.id === treeId
          ? {
              ...tree,
              lastWateredAt: new Date().toISOString(),
              healthIndex: Math.min(100, tree.healthIndex + 2),
              careIndex: tree.careIndex + 1,
            }
          : tree
      ),
    })),

  listTreeForSale: (treeId, price) =>
    set((state) => ({
      trees: state.trees.map((tree) =>
        tree.id === treeId ? { ...tree, listed: true, price } : tree
      ),
    })),

  unlistTree: (treeId) =>
    set((state) => ({
      trees: state.trees.map((tree) =>
        tree.id === treeId ? { ...tree, listed: false, price: undefined } : tree
      ),
    })),

  buyTree: (treeId) => {
    const state = get();
    if (!state.user) return;
    
    set((state) => ({
      trees: state.trees.map((tree) =>
        tree.id === treeId
          ? {
              ...tree,
              ownerId: state.user!.id,
              ownerName: state.user!.displayName,
              listed: false,
              price: undefined,
            }
          : tree
      ),
    }));
  },
}));
