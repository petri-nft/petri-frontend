import { create } from 'zustand';
import { Tree, User, ChatMessage, Lesson } from '@/types';
import { apiClient } from '@/lib/api';

interface AppState {
  user: User | null;
  token: string | null;
  trees: Tree[];
  chatMessages: ChatMessage[];
  currentTreeId: string | null;
  isLoading: boolean;
  
  // Auth actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Tree actions
  setTrees: (trees: Tree[]) => void;
  addTree: (tree: Tree) => void;
  updateTree: (treeId: string, updates: Partial<Tree>) => void;
  deleteTree: (treeId: string) => void;
  fetchTrees: () => Promise<void>;
  
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
  isLoading: false,

  setUser: (user: User | null) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = (await apiClient.login(email, password)) as Record<string, unknown>;
      
      const user: User = {
        id: String(response.user_id || response.id || '1'),
        email,
        displayName: (response.username as string) || email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      
      // Store user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Store token to localStorage
      localStorage.setItem('auth_token', response.access_token as string);
      
      // CRITICAL: Set token in apiClient so subsequent requests include Authorization header
      apiClient.setToken(response.access_token as string);
      
      set({ 
        user, 
        token: response.access_token as string,
        trees: [],
      });
      
      // Fetch user's trees
      await get().fetchTrees();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, password: string, displayName: string) => {
    try {
      set({ isLoading: true });
      const response = (await apiClient.register(email, password, displayName)) as Record<string, unknown>;
      
      const user: User = {
        id: String(response.user_id || response.id || '1'),
        email,
        displayName,
        createdAt: new Date().toISOString(),
      };
      
      // Store user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Store token to localStorage
      localStorage.setItem('auth_token', response.access_token as string);
      
      // CRITICAL: Set token in apiClient so subsequent requests include Authorization header
      apiClient.setToken(response.access_token as string);
      
      set({ 
        user, 
        token: response.access_token as string,
        trees: [],
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    apiClient.setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('trees_state');
    set({ user: null, token: null, trees: [], chatMessages: [] });
  },

  fetchTrees: async () => {
    try {
      set({ isLoading: true });
      const response = await apiClient.getTrees();
      
      // Backend returns array of TreeListResponse objects
      const treesArray = (Array.isArray(response) ? response : (response as Record<string, unknown>).trees || []) as unknown[];
      
      // Load stored photos from localStorage (maps photo_id -> base64)
      const storedPhotos: Record<string, string> = {};
      try {
        const photosMap = localStorage.getItem('tree_photos');
        if (photosMap) {
          Object.assign(storedPhotos, JSON.parse(photosMap));
        }
      } catch (e) {
        console.error('Failed to load stored photos:', e);
      }
      
      // Load tree photo map (maps tree_id -> base64 photo)
      const treePhotoMap: Record<string, string> = {};
      try {
        const photoMap = localStorage.getItem('tree_photo_map');
        if (photoMap) {
          Object.assign(treePhotoMap, JSON.parse(photoMap));
        }
      } catch (e) {
        console.error('Failed to load tree photo map:', e);
      }
      
      // Load stored NFT images from localStorage
      const storedNftImages: Record<string, string> = {};
      try {
        const nftImagesMap = localStorage.getItem('tree_nft_images');
        if (nftImagesMap) {
          Object.assign(storedNftImages, JSON.parse(nftImagesMap));
        }
      } catch (e) {
        console.error('Failed to load stored NFT images:', e);
      }
      
      // Try to load persisted state for user actions (water, progress, listing)
      const persistedState: Record<string, Partial<Tree>> = {};
      try {
        const persistedTrees = localStorage.getItem('trees_state');
        if (persistedTrees) {
          const persistedArray = JSON.parse(persistedTrees);
          persistedArray.forEach((t: Tree) => {
            persistedState[String(t.id)] = t;
          });
        }
      } catch (e) {
        console.error('Failed to parse persisted trees:', e);
      }
      
      // Convert backend response format to frontend Tree format
      const convertedTrees: Tree[] = treesArray.map((t: unknown) => {
        const tObj = t as Record<string, unknown>;
        const persisted = persistedState[String(tObj.id)];
        const userId = tObj.user_id as number;
        const treeId = String(tObj.id);
        const treeIdNum = Number(treeId);
        
        // Get stored photo using tree ID mapping (maps tree_id -> actual base64 photo)
        const treePhoto = treePhotoMap[treeIdNum];
        // Get stored NFT image if it exists
        const storedNftImage = storedNftImages[treeId] || (tObj.nft_image_url as string);
        
        return {
          id: treeId,
          user_id: userId,
          ownerId: userId,
          ownerName: get().user?.displayName || 'Unknown',
          species: tObj.species as string,
          nickname: tObj.nickname as string | undefined,
          latitude: tObj.latitude as number,
          longitude: tObj.longitude as number,
          location_name: tObj.location_name as string,
          plantedAt: tObj.planting_date as string,
          planting_date: tObj.planting_date as string,
          healthIndex: tObj.health_score as number,
          health_score: tObj.health_score as number,
          current_value: tObj.current_value as number,
          careIndex: persisted?.careIndex || 0,
          stewardshipScore: persisted?.stewardshipScore || 0,
          lastWateredAt: persisted?.lastWateredAt,
          listed: persisted?.listed || false,
          price: persisted?.price,
          // Use tree photo if available, otherwise empty
          photos: treePhoto ? [{
            id: 'captured',
            url: treePhoto,
            takenAt: new Date().toISOString(),
            note: 'Captured photo'
          }] : [],
          nft_image_url: storedNftImage,
          created_at: tObj.created_at as string,
          updated_at: tObj.updated_at as string,
        };
      }) as Tree[];
      
      set({ trees: convertedTrees });
      // Also persist the final merged state
      localStorage.setItem('trees_state', JSON.stringify(convertedTrees));
    } catch (error) {
      console.error('Failed to fetch trees:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setTrees: (trees) => set({ trees }),

  addTree: (tree) => set((state) => {
    const updatedTrees = [...state.trees, tree];
    // Persist to localStorage
    localStorage.setItem('trees_state', JSON.stringify(updatedTrees));
    return { trees: updatedTrees };
  }),

  updateTree: (treeId, updates) =>
    set((state) => {
      const updatedTrees = state.trees.map((tree) =>
        tree.id === treeId ? { ...tree, ...updates } : tree
      );
      // Persist to localStorage
      localStorage.setItem('trees_state', JSON.stringify(updatedTrees));
      return { trees: updatedTrees };
    }),

  deleteTree: (treeId) =>
    set((state) => {
      const updatedTrees = state.trees.filter((tree) => tree.id !== treeId);
      // Persist to localStorage
      localStorage.setItem('trees_state', JSON.stringify(updatedTrees));
      return { trees: updatedTrees };
    }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  setChatMessages: (messages) => set({ chatMessages: messages }),

  completeLesson: (treeId, lessonId) =>
    set((state) => {
      const updatedTrees = state.trees.map((tree) =>
        tree.id === treeId
          ? {
              ...tree,
              stewardshipScore: tree.stewardshipScore + 5,
              careIndex: tree.careIndex + 3,
            }
          : tree
      );
      // Persist to localStorage
      localStorage.setItem('trees_state', JSON.stringify(updatedTrees));
      return { trees: updatedTrees };
    }),

  waterTree: (treeId) =>
    set((state) => {
      const updatedTrees = state.trees.map((tree) =>
        tree.id === treeId
          ? {
              ...tree,
              lastWateredAt: new Date().toISOString(),
              healthIndex: Math.min(100, tree.healthIndex + 2),
              careIndex: tree.careIndex + 1,
            }
          : tree
      );
      // Persist to localStorage
      localStorage.setItem('trees_state', JSON.stringify(updatedTrees));
      return { trees: updatedTrees };
    }),

  listTreeForSale: (treeId, price) =>
    set((state) => {
      const updatedTrees = state.trees.map((tree) =>
        tree.id === treeId ? { ...tree, listed: true, price } : tree
      );
      // Persist to localStorage
      localStorage.setItem('trees_state', JSON.stringify(updatedTrees));
      return { trees: updatedTrees };
    }),

  unlistTree: (treeId) =>
    set((state) => {
      const updatedTrees = state.trees.map((tree) =>
        tree.id === treeId ? { ...tree, listed: false, price: undefined } : tree
      );
      // Persist to localStorage
      localStorage.setItem('trees_state', JSON.stringify(updatedTrees));
      return { trees: updatedTrees };
    }),

  buyTree: (treeId) => {
    const state = get();
    if (!state.user) return;
    
    const updatedTrees = state.trees.map((tree) =>
      tree.id === treeId
        ? {
            ...tree,
            ownerId: state.user!.id,
            ownerName: state.user!.displayName,
            listed: false,
            price: undefined,
          }
        : tree
    );
    
    // Persist to localStorage
    localStorage.setItem('trees_state', JSON.stringify(updatedTrees));
    set({ trees: updatedTrees });
  },
}));
