/**
 * Example Integration for PlantTree Component
 * 
 * This shows how to integrate NFT generation into your existing PlantTree.tsx
 * Adjust as needed for your specific component structure
 */

// Import the NFT API functions
import { generateTreeNFT, NFTGenerationResponse } from '@/lib/nftApi';

// Example 1: Basic integration after tree creation
export async function plantTreeAndGenerateNFT(
  treeData: TreeCreateData,
  capturedImage: Blob | File,
  authToken: string
) {
  try {
    // 1. Create the tree first
    const treeResponse = await api.post('/api/trees', treeData, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const treeId = treeResponse.data.id;
    console.log(`Tree planted with ID: ${treeId}`);

    // 2. Generate NFT with the captured image
    const imageFile = capturedImage instanceof File 
      ? capturedImage 
      : new File([capturedImage], `tree-${treeId}.jpg`, { type: 'image/jpeg' });

    const nftResult = await generateTreeNFT(
      treeId,
      imageFile,
      authToken,
      'http://localhost:8000'
    );

    console.log('NFT Generated:', nftResult);
    
    return {
      tree: treeResponse.data,
      nft: nftResult,
    };
  } catch (error) {
    console.error('Error planting tree or generating NFT:', error);
    throw error;
  }
}


// Example 2: React component hook
import { useState } from 'react';

interface NFTGenerationState {
  isGenerating: boolean;
  nftData: NFTGenerationResponse | null;
  error: string | null;
}

export function useNFTGeneration() {
  const [state, setState] = useState<NFTGenerationState>({
    isGenerating: false,
    nftData: null,
    error: null,
  });

  const generateNFT = async (
    treeId: number,
    imageFile: File,
    authToken: string
  ) => {
    setState({ isGenerating: true, nftData: null, error: null });
    
    try {
      const result = await generateTreeNFT(treeId, imageFile, authToken);
      setState({ isGenerating: false, nftData: result, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ isGenerating: false, nftData: null, error: errorMessage });
      throw error;
    }
  };

  return { ...state, generateNFT };
}


// Example 3: Integration with PlantTree component
/*
import { FC, useState, useRef } from 'react';
import { useNFTGeneration } from './useNFTGeneration';
import { CameraCapture } from '@/components/CameraCapture';

interface PlantTreeProps {
  onSuccess?: (data: { tree: Tree; nft: NFTGenerationResponse }) => void;
}

export const PlantTree: FC<PlantTreeProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { isGenerating, nftData, error: nftError, generateNFT } = useNFTGeneration();
  const cameraRef = useRef<CameraCapture>(null);

  const handlePlantTree = async (formData: TreeFormData) => {
    setLoading(true);
    
    try {
      // 1. Capture image
      const imageBlob = await cameraRef.current?.captureImage();
      if (!imageBlob) {
        throw new Error('Failed to capture image');
      }

      // 2. Create tree
      const authToken = localStorage.getItem('authToken');
      const treeResponse = await fetch('/api/trees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!treeResponse.ok) throw new Error('Failed to create tree');
      const tree = await treeResponse.json();

      // 3. Convert blob to file and generate NFT
      const imageFile = new File([imageBlob], `tree-${tree.id}.jpg`, {
        type: 'image/jpeg',
      });

      const nftResult = await generateNFT(tree.id, imageFile, authToken);

      // 4. Handle success
      onSuccess?.({ tree, nft: nftResult });

    } catch (error) {
      console.error('Error:', error);
      // Handle error UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CameraCapture ref={cameraRef} />
      
      <button 
        onClick={() => handlePlantTree({ /* form data */ })}
        disabled={loading || isGenerating}
      >
        {isGenerating ? 'Generating NFT...' : 'Plant Tree & Generate NFT'}
      </button>

      {nftError && <div style={{ color: 'red' }}>Error: {nftError}</div>}
      
      {nftData && (
        <div>
          <h2>NFT Generated!</h2>
          <img src={nftData.imageUrl} alt="Your NFT" />
          <p>Token ID: {nftData.token_id}</p>
          <a href={nftData.metadataUrl} target="_blank">
            View Metadata
          </a>
        </div>
      )}
    </div>
  );
};
*/


// Example 4: API integration in your api.ts file
/*
// Add to /frontend/src/lib/api.ts

export const nftApi = {
  generateNFT: async (treeId: number, imageFile: File) => {
    const formData = new FormData();
    formData.append('user_image', imageFile);

    const response = await fetch(
      `/api/trees/${treeId}/generate-nft`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Failed to generate NFT');
    return response.json();
  },
};

// Usage
const nftResult = await nftApi.generateNFT(treeId, imageFile);
*/


// Example 5: Update PlantTree page to show NFT after creation
/*
import { useState } from 'react';
import { TreeCard } from '@/components/TreeCard';
import { generateTreeNFT } from '@/lib/nftApi';

export default function PlantTreePage() {
  const [plantedTree, setPlantedTree] = useState(null);
  const [nftData, setNftData] = useState(null);

  const handleTreePlanted = async (tree, imageFile) => {
    setPlantedTree(tree);

    try {
      const authToken = localStorage.getItem('authToken');
      const nft = await generateTreeNFT(tree.id, imageFile, authToken);
      setNftData(nft);
    } catch (error) {
      console.error('NFT generation failed:', error);
    }
  };

  return (
    <div>
      {!plantedTree ? (
        <PlantTreeForm onSubmit={handleTreePlanted} />
      ) : (
        <div>
          <TreeCard tree={plantedTree} />
          {nftData && (
            <div className="nft-preview">
              <h3>Your NFT</h3>
              <img src={nftData.imageUrl} alt="NFT" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
*/


// Example 6: Add to store/useStore.ts for state management
/*
export const useTreeStore = create((set) => ({
  // ... existing code ...
  
  plantTreeWithNFT: async (formData, imageFile, authToken) => {
    try {
      // Create tree
      const treeRes = await fetch('/api/trees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const tree = await treeRes.json();

      // Generate NFT
      const nftResult = await generateTreeNFT(tree.id, imageFile, authToken);

      // Update store
      set((state) => ({
        trees: [...state.trees, tree],
      }));

      return { tree, nft: nftResult };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
}));
*/
