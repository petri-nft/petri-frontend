import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { HealthBadge } from '@/components/HealthBadge';
import { LessonCard } from '@/components/LessonCard';
import { TreePersonalitySetup } from '@/components/TreePersonalitySetup';
import { TreeChat } from '@/components/TreeChat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Droplet, Camera, Store, MapPin, Calendar, TrendingUp, Brain, MessageSquare } from 'lucide-react';
import { getRelativeTime, formatDate } from '@/lib/utils/helpers';
import { mockLessons } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { TreePersonality } from '@/types';
import { apiClient } from '@/lib/api';

const TreeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trees, waterTree, completeLesson, listTreeForSale } = useStore();
  const { toast } = useToast();
  const [personality, setPersonality] = useState<TreePersonality | null>(null);
  const [loadingPersonality, setLoadingPersonality] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Validate and parse tree ID
  const treeId = id && !isNaN(Number(id)) ? id : null;
  const tree = treeId ? trees.find(t => t.id === treeId) : null;
  const isOwner = true; // TODO: Get actual owner from auth context

  // Load personality when tree ID changes
  useEffect(() => {
    if (!treeId) return;
    
    const loadPersonality = async () => {
      try {
        setLoadingPersonality(true);
        const response = await apiClient.getTreePersonality(treeId);
        const typed = response as TreePersonality;
        if (typed && 'id' in typed) {
          setPersonality(typed);
        }
      } catch (error) {
        // No personality set yet - that's okay
        console.log('No personality set for this tree');
        setPersonality(null);
      } finally {
        setLoadingPersonality(false);
      }
    };

    loadPersonality();
  }, [treeId]);

  if (!treeId || !tree) {
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

  const handlePersonalitySet = (newPersonality: TreePersonality) => {
    setPersonality(newPersonality);
    toast({
      title: 'Personality Set! 🎭',
      description: `${tree.nickname || tree.species} now has a personality!`,
    });
    // Auto-switch to chat tab after personality is set
    setTimeout(() => {
      setActiveTab('chat');
    }, 500);
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
        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personality">
              <Brain className="w-4 h-4 mr-2" />
              Personality
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Header */}
            <div className="grid md:grid-cols-2 gap-8">
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
                  {!tree.listed && (
                    <Button variant="outline" onClick={handleListForSale} className="flex-1">
                      <Store className="w-4 h-4 mr-2" />
                      List for Sale
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Health Panel */}
            <Card className="p-6">
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
            <Card className="p-6">
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
          </TabsContent>

          {/* Personality Tab */}
          <TabsContent value="personality">
            {isOwner ? (
              <TreePersonalitySetup
                treeId={parseInt(treeId)}
                onPersonalitySet={handlePersonalitySet}
                isOwner={isOwner}
              />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Only the tree owner can set its personality.</p>
              </Card>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            {personality ? (
              <TreeChat treeId={parseInt(treeId)} treeName={tree.nickname || tree.species} personality={personality} />
            ) : (
              <Card className="p-8 text-center space-y-4">
                <p className="text-muted-foreground">Set up a personality first to start chatting!</p>
                <Button onClick={() => setActiveTab('personality')}>
                  <Brain className="w-4 h-4 mr-2" />
                  Create Personality
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Next Lesson from Sage</h2>
            <LessonCard lesson={relevantLesson} onComplete={handleCompleteLesson} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TreeDetail;
