import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { HealthBadge } from '@/components/HealthBadge';
import { LessonCard } from '@/components/LessonCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Droplet, Camera, MessageCircle, Store, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { getRelativeTime, formatDate } from '@/lib/utils/helpers';
import { mockLessons } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const TreeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trees, waterTree, completeLesson, listTreeForSale } = useStore();
  const { toast } = useToast();
  
  const tree = trees.find(t => t.id === id);
  
  if (!tree) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Tree Not Found</h2>
          <Button onClick={() => navigate('/trees')}>Back to Trees</Button>
        </div>
      </div>
    );
  }
  
  const latestPhoto = tree.photos[tree.photos.length - 1];
  const lastWatered = tree.lastWateredAt ? getRelativeTime(tree.lastWateredAt) : 'Never';
  const relevantLesson = mockLessons.find(l => l.speciesTag === tree.species) || mockLessons[0];
  
  const handleWater = () => {
    waterTree(tree.id);
    toast({
      title: 'Tree Watered! 💧',
      description: 'Health +2, Care Index +1',
    });
  };
  
  const handleCompleteLesson = (lessonId: string, correct: boolean) => {
    completeLesson(tree.id, lessonId);
    toast({
      title: correct ? 'Perfect! 🎉' : 'Good Try! 📚',
      description: correct ? '+5 Stewardship Score' : 'Keep learning!',
    });
  };
  
  const handleListForSale = () => {
    const price = Math.floor(Math.random() * 100) + 50;
    listTreeForSale(tree.id, price);
    toast({
      title: 'Listed for Sale',
      description: `Your tree is now on the marketplace at $${price}`,
    });
  };
  
  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/trees')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trees
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="relative rounded-2xl overflow-hidden h-96">
            <img
              src={latestPhoto?.url}
              alt={tree.nickname || tree.species}
              className="w-full h-full object-cover"
            />
            {tree.listed && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                Listed for ${tree.price}
              </Badge>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {tree.nickname || tree.species}
                </h1>
                <HealthBadge healthIndex={tree.healthIndex} />
              </div>
              <p className="text-lg text-muted-foreground">{tree.species}</p>
              <p className="text-sm text-muted-foreground">Token: {tree.tokenId}</p>
            </div>
            
            <div className="space-y-3">
              {tree.location?.label && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{tree.location.label}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Planted {formatDate(tree.plantedAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Droplet className="w-4 h-4" />
                <span>Last watered: {lastWatered}</span>
              </div>
            </div>
            
            {tree.characteristics && (
              <div className="flex flex-wrap gap-2">
                {tree.characteristics.size && (
                  <Badge variant="secondary">{tree.characteristics.size}</Badge>
                )}
                {tree.characteristics.light && (
                  <Badge variant="secondary">{tree.characteristics.light}</Badge>
                )}
                {tree.characteristics.soilType && (
                  <Badge variant="secondary">{tree.characteristics.soilType}</Badge>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={handleWater} className="flex-1 bg-primary hover:bg-primary/90">
                <Droplet className="w-4 h-4 mr-2" />
                Water
              </Button>
              <Button variant="outline" onClick={() => navigate(`/submit?treeId=${tree.id}`)}>
                <Camera className="w-4 h-4 mr-2" />
                Log Progress
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Link to={`/chat?treeId=${tree.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Sage
                </Button>
              </Link>
              {!tree.listed && (
                <Button variant="outline" onClick={handleListForSale}>
                  <Store className="w-4 h-4 mr-2" />
                  List for Sale
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Health Panel */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Health Metrics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Health Index</div>
              <Progress value={tree.healthIndex} className="h-3 mb-2" />
              <div className="text-2xl font-bold text-foreground">{tree.healthIndex}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Care Index</div>
              <Progress value={(tree.careIndex / 100) * 100} className="h-3 mb-2" />
              <div className="text-2xl font-bold text-foreground">{tree.careIndex}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Stewardship Score</div>
              <Progress value={(tree.stewardshipScore / 100) * 100} className="h-3 mb-2" />
              <div className="text-2xl font-bold text-foreground">{tree.stewardshipScore}</div>
            </div>
          </div>
          
          {tree.ndvi && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>NDVI (vegetation health)</span>
              </div>
              <div className="text-2xl font-bold text-primary">{tree.ndvi.toFixed(2)}</div>
            </div>
          )}
        </Card>
        
        {/* Care Log */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Care Log</h2>
          <div className="space-y-4">
            {tree.photos.map((photo) => (
              <div key={photo.id} className="flex gap-4 items-start">
                <img
                  src={photo.url}
                  alt="Care log"
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{formatDate(photo.takenAt)}</div>
                  <div className="text-sm text-muted-foreground">{photo.note || 'Progress update'}</div>
                  <div className="text-xs text-muted-foreground mt-1">{getRelativeTime(photo.takenAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Education Panel */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Next Lesson from Sage</h2>
          <LessonCard lesson={relevantLesson} onComplete={handleCompleteLesson} />
        </div>
      </main>
    </div>
  );
};

export default TreeDetail;
