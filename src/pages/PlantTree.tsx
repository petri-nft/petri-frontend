import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CameraCapture } from '@/components/CameraCapture';
import { ArrowLeft, Camera, Check } from 'lucide-react';
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
  const { user, addTree, fetchTrees } = useStore();
  const { toast } = useToast();
  
  const [species, setSpecies] = useState('');
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [light, setLight] = useState('');
  const [soilType, setSoilType] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePhotoCapture = (url: string) => {
    setPhotoUrl(url);
    setShowCamera(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // Prepare tree data for backend
      const treeData = {
        species: backendSpecies,
        latitude: 0, // Default location
        longitude: 0,
        location_name: location || 'Unknown Location',
        description: nickname || `A beautiful ${species}`,
      };
      
      // Create tree on backend
      const response = await apiClient.plantTree(treeData);
      const backendTree = response as any;
      
      // Create frontend tree object with response data, mapping backend fields to frontend format
      const newTree: Tree = {
        id: String(backendTree.id), // Convert to string for consistency
        user_id: backendTree.user_id,
        ownerId: backendTree.user_id,
        ownerName: user!.displayName,
        species,
        nickname: nickname || undefined,
        location: location ? { label: location } : undefined,
        location_name: backendTree.location_name,
        plantedAt: backendTree.planting_date,
        planting_date: backendTree.planting_date,
        healthIndex: backendTree.health_score,
        health_score: backendTree.health_score,
        current_value: backendTree.current_value,
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
        created_at: backendTree.created_at,
        updated_at: backendTree.updated_at,
      };
      
      // Add tree to store immediately
      addTree(newTree);
      
      toast({
        title: 'Tree Planted! 🌱',
        description: `Your ${species} has been added to your forest`,
      });
      
      // Refresh trees from backend to ensure sync
      setTimeout(async () => {
        await fetchTrees();
      }, 500);
      
      // Navigate back to trees list
      setTimeout(() => {
        navigate('/trees');
      }, 1000);
    } catch (error) {
      console.error('Failed to plant tree:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to plant tree. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
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
              <Label htmlFor="nickname">Nickname (optional)</Label>
              <Input
                id="nickname"
                placeholder="Give your tree a name"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
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
                disabled={isSubmitting}
              >
                <Check className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Planting...' : 'Plant & Mint Token'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Sage will queue your first care lesson for this species
              </p>
            </div>
          </form>
        </Card>
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
