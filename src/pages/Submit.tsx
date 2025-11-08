import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { CameraCapture } from '@/components/CameraCapture';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/lib/utils/helpers';

const Submit = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, trees, updateTree } = useStore();
  const { toast } = useToast();
  
  const treeId = searchParams.get('treeId');
  const [selectedTreeId, setSelectedTreeId] = useState(treeId || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [note, setNote] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userTrees = trees.filter(t => t.ownerId === user?.id);
  const selectedTree = trees.find(t => t.id === selectedTreeId);
  
  useEffect(() => {
    if (treeId) {
      setSelectedTreeId(treeId);
    }
  }, [treeId]);
  
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
        description: 'Please capture a progress photo',
      });
      return;
    }
    
    if (!selectedTreeId) {
      toast({
        variant: 'destructive',
        title: 'Select a Tree',
        description: 'Please choose which tree to update',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const tree = trees.find(t => t.id === selectedTreeId);
    if (!tree) return;
    
    const newPhoto = {
      id: generateId(),
      url: photoUrl,
      takenAt: new Date().toISOString(),
      note: note || undefined,
    };
    
    updateTree(selectedTreeId, {
      photos: [...tree.photos, newPhoto],
      careIndex: tree.careIndex + 2,
      healthIndex: Math.min(100, tree.healthIndex + 3),
    });
    
    toast({
      title: 'Progress Logged! 📸',
      description: 'Care Index +2, Health +3. Sage is impressed!',
    });
    
    setTimeout(() => {
      navigate(`/trees/${selectedTreeId}`);
    }, 500);
  };
  
  const latestPhoto = selectedTree?.photos[selectedTree.photos.length - 1];
  
  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Submit Weekly Progress</h1>
          <p className="text-muted-foreground">
            Track your tree's growth with photos and notes
          </p>
        </div>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Tree */}
            {!treeId && (
              <div className="space-y-2">
                <Label htmlFor="tree">Select Tree *</Label>
                <select
                  id="tree"
                  value={selectedTreeId}
                  onChange={(e) => setSelectedTreeId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                >
                  <option value="">Choose a tree...</option>
                  {userTrees.map((tree) => (
                    <option key={tree.id} value={tree.id}>
                      {tree.nickname || tree.species} - Health: {tree.healthIndex}%
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Before/After Preview */}
            {selectedTree && latestPhoto && (
              <div className="space-y-2">
                <Label>Last Photo</Label>
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={latestPhoto.url}
                    alt="Previous"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                    Previous
                  </div>
                </div>
              </div>
            )}
            
            {/* New Photo */}
            <div className="space-y-2">
              <Label>New Progress Photo *</Label>
              {photoUrl ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={photoUrl} alt="New progress" className="w-full h-64 object-cover" />
                  <div className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-primary-foreground">
                    New
                  </div>
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
                  Capture Progress Photo
                </Button>
              )}
            </div>
            
            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Notes (optional)</Label>
              <Textarea
                id="note"
                placeholder="Any observations? New growth, issues, or changes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              <Check className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Progress'}
            </Button>
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

export default Submit;
