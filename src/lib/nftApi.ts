import axios from 'axios';

/**
 * NFT Generation API
 * 
 * Usage in React component:
 * const imageFile = await captureImage(); // from your CameraCapture component
 * const result = await generateTreeNFT(treeId, imageFile, authToken);
 */

export interface NFTGenerationResponse {
  status: string;
  imageUrl: string;
  metadataUrl: string;
  token_id: number;
  message: string;
}

export async function generateTreeNFT(
  treeId: number,
  imageFile: File,
  authToken: string,
  baseURL: string = 'http://localhost:8000'
): Promise<NFTGenerationResponse> {
  try {
    const formData = new FormData();
    formData.append('user_image', imageFile);

    const response = await axios.post<NFTGenerationResponse>(
      `${baseURL}/api/trees/${treeId}/generate-nft`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error generating NFT:', error);
    throw error;
  }
}

/**
 * Convert captured blob to File and generate NFT
 */
export async function generateNFTFromBlob(
  capturedImageBlob: Blob,
  treeId: number,
  authToken: string,
  baseURL?: string
) {
  // Convert Blob to File if needed
  const imageFile = new File([capturedImageBlob], `tree-${treeId}.jpg`, {
    type: 'image/jpeg',
  });

  // Generate NFT
  const result = await generateTreeNFT(treeId, imageFile, authToken, baseURL);

  return {
    nftImageUrl: result.imageUrl,
    metadataUrl: result.metadataUrl,
    tokenId: result.token_id,
  };
}

/**
 * Helper to handle NFT generation with error handling
 */
export async function handleNFTGeneration(
  treeId: number,
  imageFile: File,
  authToken: string,
  onSuccess?: (data: NFTGenerationResponse) => void,
  onError?: (error: Error) => void,
  baseURL?: string
) {
  try {
    const result = await generateTreeNFT(treeId, imageFile, authToken, baseURL);
    console.log('NFT Generated Successfully!');
    console.log('Image URL:', result.imageUrl);
    console.log('Metadata URL:', result.metadataUrl);
    console.log('Token ID:', result.token_id);
    onSuccess?.(result);
    return result;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    console.error('NFT generation failed:', error);
    onError?.(error);
    throw error;
  }
}
