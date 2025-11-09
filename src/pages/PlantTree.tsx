import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CameraCapture } from '@/components/CameraCapture';
import { ArrowLeft, Camera, Check, Sparkles, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/lib/utils/helpers';
import { Tree } from '@/types';
import { apiClient } from '@/lib/api';

// Mapping of display names to backend enum values
const SPECIES_MAP: Record<string, string> = {
  'Coast Redwood': 'spruce',
  'Japanese Maple': 'maple',
  'White Oak': 'oak',
  'Blue Spruce': 'spruce',
  'Weeping Willow': 'elm',
  'Douglas Fir': 'spruce',
  'Sugar Maple': 'maple',
  'Black Walnut': 'elm',
};

const SPECIES = Object.keys(SPECIES_MAP);

const SIZES = ['Seedling (< 1 ft)', 'Sapling (2-3 ft)', 'Young tree (4-6 ft)', 'Established (6+ ft)'];
const LIGHT_NEEDS = ['Full sun', 'Partial shade', 'Full shade'];
const SOIL_TYPES = ['Sandy', 'Loamy', 'Clay', 'Well-draining', 'Moist'];

const PlantTree = () => {
  const navigate = useNavigate();
  const { user, addTree, fetchTrees, token } = useStore();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [species, setSpecies] = useState('');
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [light, setLight] = useState('');
  const [soilType, setSoilType] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nftImage, setNftImage] = useState<string | null>(null);
  const [nftMetadata, setNftMetadata] = useState<Record<string, unknown> | null>(null);
  const [isGeneratingNft, setIsGeneratingNft] = useState(false);
  const [treeId, setTreeId] = useState<number | null>(null);
  
  const handlePhotoCapture = (url: string) => {
    setPhotoUrl(url);
    setShowCamera(false);
  };
  
  const generateNFT = async (treeIdNum: number, imageBlobUrl: string) => {
    try {
      setIsGeneratingNft(true);
      
      // Convert blob URL to File
      const response = await fetch(imageBlobUrl);
      const blob = await response.blob();
      const file = new File([blob], 'tree-photo.jpg', { type: 'image/jpeg' });
      
      // Get auth token - try store first, then localStorage
      const authToken = token || localStorage.getItem('auth_token');
      if (!authToken) {
        console.log('Token from store:', token);
        console.log('Token from localStorage:', localStorage.getItem('auth_token'));
        throw new Error('Authentication token not found');
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('user_image', file);
      
      // Call backend API
      const nftResponse = await fetch(
        `http://localhost:8000/api/trees/${treeIdNum}/generate-nft`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: formData,
        }
      );
      
      if (!nftResponse.ok) {
        const errorData = await nftResponse.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.detail || 'Failed to generate NFT');
      }
      
      const nftData = await nftResponse.json();
      
      // Fetch and display the metadata
      const metadataResponse = await fetch(nftData.metadataUrl);
      const metadata = await metadataResponse.json();
      
      // Store NFT image URL locally (same as photos)
      const nftImagesMap = JSON.parse(localStorage.getItem('tree_nft_images') || '{}');
      nftImagesMap[treeIdNum] = nftData.imageUrl;
      localStorage.setItem('tree_nft_images', JSON.stringify(nftImagesMap));
      
      setNftImage(nftData.imageUrl);
      setNftMetadata(metadata);
      
      toast({
        title: 'NFT Generated! 🎨',
        description: 'Your TreeToken has been created successfully',
      });
      
    } catch (error) {
      console.error('NFT generation error:', error);
      toast({
        variant: 'destructive',
        title: 'NFT Generation Failed',
        description: error instanceof Error ? error.message : 'Could not generate NFT',
      });
    } finally {
      setIsGeneratingNft(false);
    }
  };
  
  const downloadNFT = () => {
    if (!nftImage) return;
    
    const link = document.createElement('a');
    link.href = nftImage;
    link.download = `tree-token-${treeId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      toast({
        variant: 'destructive',
        title: 'Tree Name Required',
        description: 'Please give your tree a unique name',
      });
      return;
    }
    
    if (!species) {
      toast({
        variant: 'destructive',
        title: 'Species Required',
        description: 'Please select a tree species',
      });
      return;
    }
    
    if (!photoUrl) {
      toast({
        variant: 'destructive',
        title: 'Photo Required',
        description: 'Please capture a photo of your tree',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Map display name to backend enum value
      const backendSpecies = SPECIES_MAP[species] || species.toLowerCase();
      
      // Create a unique identifier for the photo
      const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store the photo data in localStorage with the photo ID
      const photosMap = JSON.parse(localStorage.getItem('tree_photos') || '{}');
      photosMap[photoId] = photoUrl;
      localStorage.setItem('tree_photos', JSON.stringify(photosMap));
      
      // Prepare tree data for backend
      // Send photo_url as an identifier string (not the huge base64)
      const treeData = {
        species: backendSpecies,
        latitude: 0,
        longitude: 0,
        location_name: location || 'Unknown Location',
        description: `A beautiful ${species}`,
        nickname: nickname.trim(), // REQUIRED
        photo_url: photoId, // Send just the ID, not the huge base64
      };
      
      // Create tree on backend
      const response = await apiClient.plantTree(treeData);
      const backendTree = response as Record<string, unknown>;
      const backendTreeId = backendTree.id as number;

      setTreeId(backendTreeId);
      
      // Also map photo_url (which now contains the photoId) back to actual photo for later
      const treePhotoMap = JSON.parse(localStorage.getItem('tree_photo_map') || '{}');
      treePhotoMap[backendTreeId] = photoUrl;  // Map tree ID to actual photo base64
      localStorage.setItem('tree_photo_map', JSON.stringify(treePhotoMap));      // Create frontend tree object with response data, mapping backend fields to frontend format
      const newTree: Tree = {
        id: String(backendTreeId), // Convert to string for consistency
        user_id: backendTree.user_id as number,
        ownerId: backendTree.user_id as number,
        ownerName: user!.displayName,
        species,
        nickname: (backendTree.nickname as string) || undefined,
        location: location ? { label: location } : undefined,
        location_name: backendTree.location_name as string,
        plantedAt: backendTree.planting_date as string,
        planting_date: backendTree.planting_date as string,
        healthIndex: backendTree.health_score as number,
        health_score: backendTree.health_score as number,
        current_value: backendTree.current_value as number,
        photos: [
          {
            id: generateId(),
            url: photoUrl,
            takenAt: new Date().toISOString(),
            note: 'First planting!',
          },
        ],
        careIndex: 0,
        stewardshipScore: 0,
        tokenId: `TT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        characteristics: {
          size,
          light,
          soilType,
        },
        created_at: backendTree.created_at as string,
        updated_at: backendTree.updated_at as string,
      };
      
      // Add tree to store immediately
      addTree(newTree);
      
      toast({
        title: 'Tree Planted! 🌱',
        description: `Your ${species} has been added to your forest`,
      });
      
      // Generate NFT
      await generateNFT(backendTreeId, photoUrl);
      
    } catch (error) {
      console.error('Failed to plant tree:', error);
      
      // Extract error message from response
      let errorMessage = 'Failed to plant tree. Please try again.';
      let errorTitle = 'Error';
      
      if (error instanceof Error) {
        const message = error.message;
        if (message.includes('already have a tree named')) {
          errorTitle = 'Duplicate Name';
          errorMessage = 'You already have a tree with that name. Please choose a different name.';
        } else if (message.includes('400') || message.includes('Bad Request')) {
          errorTitle = 'Invalid Data';
          errorMessage = 'Please check your tree details and try again.';
        } else if (message.includes('401') || message.includes('Unauthorized')) {
          errorTitle = 'Session Expired';
          errorMessage = 'Please log in again and try planting the tree.';
        } else {
          errorMessage = message;
        }
      }
      
      toast({
        variant: 'destructive',
        title: errorTitle,
        description: errorMessage,
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (nftImage) {
                navigate('/trees');
              } else {
                navigate('/');
              }
            }}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* NFT Display - Show after generation */}
        {nftImage && (
          <div className="mb-12 animate-in fade-in">
            <div className="text-center space-y-4 mb-6">
              <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                ✨ NFT Created
              </Badge>
              <h2 className="text-2xl font-bold text-foreground">Your TreeToken is Ready!</h2>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-card to-card/50">
              <div className="space-y-6">
                {/* NFT Image */}
                <div className="rounded-xl overflow-hidden bg-black/5">
                  <img 
                    src={nftImage} 
                    alt="Generated NFT" 
                    className="w-full h-auto"
                  />
                </div>
                
                {/* Metadata */}
                {nftMetadata && (
                  <div className="space-y-4">
                    <div className="bg-background/50 rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        {String((nftMetadata as Record<string, unknown>).name)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {String((nftMetadata as Record<string, unknown>).description)}
                      </p>
                      
                      {/* Attributes */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {((nftMetadata as Record<string, unknown>).attributes as Array<Record<string, string>> | undefined)?.map((attr: Record<string, string>, idx: number) => (
                          <div key={idx} className="bg-primary/5 rounded p-2">
                            <div className="text-xs text-muted-foreground">{attr.trait_type}</div>
                            <div className="font-semibold text-sm">{attr.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={downloadNFT}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download NFT
                  </Button>
                  
                  <Button
                    onClick={() => {
                      // Refresh and navigate to trees
                      fetchTrees();
                      navigate('/trees');
                    }}
                    className="w-full bg-primary hover:bg-primary/90 gap-2"
                  >
                    <Check className="w-4 h-4" />
                    View My Forest
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Form - Hide when NFT is generated */}
        {!nftImage && (
          <>
            <div className="text-center space-y-4 mb-8">
              <Badge className="bg-primary/10 text-primary border-primary/30">
                🌱 New Tree
              </Badge>
              <h1 className="text-3xl font-bold text-foreground">Plant a Tree</h1>
              <p className="text-muted-foreground">
                Capture the moment and mint your TreeToken
              </p>
            </div>
            
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo */}
                <div className="space-y-3">
                  <Label>Tree Photo *</Label>
                  {photoUrl ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={photoUrl} alt="Tree" className="w-full h-64 object-cover" />
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="absolute top-3 right-3"
                        onClick={() => setShowCamera(true)}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Retake
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 border-dashed"
                      onClick={() => setShowCamera(true)}
                    >
                      <Camera className="w-6 h-6 mr-2" />
                      Capture Photo
                    </Button>
                  )}
                </div>
                
                {/* Species */}
                <div className="space-y-2">
                  <Label htmlFor="species">Species *</Label>
                  <select
                    id="species"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                  >
                    <option value="">Select species...</option>
                    {SPECIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="nickname">Tree Name *</Label>
                  <Input
                    id="nickname"
                    placeholder="Give your tree a unique name"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Must be unique among your trees</p>
                </div>
                
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    placeholder="City, State or Region"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                {/* Characteristics */}
                <div className="space-y-4">
                  <Label>Characteristics</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="size" className="text-xs">Size</Label>
                      <select
                        id="size"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                      >
                        <option value="">Select...</option>
                        {SIZES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="light" className="text-xs">Light Needs</Label>
                      <select
                        id="light"
                        value={light}
                        onChange={(e) => setLight(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                      >
                        <option value="">Select...</option>
                        {LIGHT_NEEDS.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="soil" className="text-xs">Soil Type</Label>
                      <select
                        id="soil"
                        value={soilType}
                        onChange={(e) => setSoilType(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                      >
                        <option value="">Select...</option>
                        {SOIL_TYPES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting || isGeneratingNft}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Planting...' : isGeneratingNft ? 'Creating NFT...' : 'Plant & Mint Token'}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Sage will queue your first care lesson for this species
                  </p>
                </div>
              </form>
            </Card>
          </>
        )}
      </main>
      
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onCancel={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default PlantTree;
