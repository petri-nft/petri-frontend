import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { TreeCard } from '@/components/TreeCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Trees, Award, Store } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user, trees } = useStore();
  
  // For now, only show current user's profile
  const isOwn = !username || username === user?.displayName.toLowerCase().replace(' ', '-');
  const profileUser = user;
  
  if (!profileUser) {
    navigate('/login');
    return null;
  }
  
  const userTrees = trees.filter(t => {
    // Handle both backend (user_id) and frontend (ownerId) formats
    const treeOwnerId = (t.user_id || t.ownerId);
    const userId = profileUser?.id;
    return treeOwnerId === userId;
  });
  const ownedTrees = userTrees.filter(t => !t.listed);
  const listedTrees = userTrees.filter(t => t.listed);
  
  const avgHealth = userTrees.length > 0
    ? Math.round(userTrees.reduce((sum, t) => sum + t.healthIndex, 0) / userTrees.length)
    : 0;
  
  const totalScore = userTrees.reduce((sum, t) => sum + t.stewardshipScore, 0);
  
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
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {profileUser.displayName}
              </h1>
              <p className="text-muted-foreground mb-4">
                {profileUser.bio || 'Forest keeper and tree enthusiast'}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="gap-2">
                  <Trees className="w-4 h-4" />
                  {userTrees.length} Trees
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <Award className="w-4 h-4" />
                  {totalScore} Score
                </Badge>
                <Badge variant="secondary">
                  Avg Health: {avgHealth}%
                </Badge>
              </div>
            </div>
            
            {isOwn && (
              <Button variant="outline">Edit Profile</Button>
            )}
          </div>
        </Card>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{userTrees.length}</div>
            <div className="text-sm text-muted-foreground">Total Trees</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-accent-foreground mb-2">{avgHealth}%</div>
            <div className="text-sm text-muted-foreground">Avg Health</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-secondary-foreground mb-2">{totalScore}</div>
            <div className="text-sm text-muted-foreground">Stewardship Score</div>
          </Card>
        </div>
        
        {/* Trees Gallery */}
        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="owned">
              Owned ({ownedTrees.length})
            </TabsTrigger>
            <TabsTrigger value="listed">
              Listed ({listedTrees.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="owned" className="mt-6">
            {ownedTrees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedTrees.map(tree => (
                  <TreeCard
                    key={tree.id}
                    tree={tree}
                    onWater={(id) => navigate(`/trees/${id}`)}
                    onChat={(id) => navigate(`/chat?treeId=${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trees className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No trees yet</h3>
                <p className="text-muted-foreground mb-6">Start your forest journey</p>
                <Button onClick={() => navigate('/plant')} className="bg-primary hover:bg-primary/90">
                  Plant Your First Tree
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="listed" className="mt-6">
            {listedTrees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listedTrees.map(tree => (
                  <TreeCard key={tree.id} tree={tree} compact />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No listings</h3>
                <p className="text-muted-foreground mb-6">List trees on the marketplace</p>
                <Button onClick={() => navigate('/trade')} variant="outline">
                  Visit Marketplace
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
