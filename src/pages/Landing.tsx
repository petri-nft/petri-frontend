import { useStore } from '@/store/useStore';
import { TreeCard } from '@/components/TreeCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Trees,
  Camera,
  MessageCircle,
  Store,
  User,
  LogOut,
  Droplet,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Landing = () => {
  const { user, trees, waterTree, logout } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleWater = (treeId: string) => {
    waterTree(treeId);
    toast({
      title: 'Tree Watered! 💧',
      description: 'Your tree thanks you for the care.',
    });
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const userTrees = trees.filter(t => t.ownerId === user?.id);
  const totalHealthAvg = userTrees.length > 0
    ? Math.round(userTrees.reduce((sum, t) => sum + t.healthIndex, 0) / userTrees.length)
    : 0;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Petri</h1>
              <p className="text-xs text-muted-foreground">Forest Keeper</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-6 py-12">
          <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
            🌱 Your Forest Journey
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground max-w-3xl mx-auto">
            Plant, Nurture, and Trade Living TreeTokens
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every tree you plant becomes a dynamic token. Learn AI-guided care from Sage, track
            health with real data, and trade fractional ownership.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Link to="/plant">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Sprout className="w-5 h-5 mr-2" />
                Plant a Tree
              </Button>
            </Link>
            <Link to="/trees">
              <Button size="lg" variant="outline">
                <Trees className="w-5 h-5 mr-2" />
                View Your Forest
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Stats */}
        {userTrees.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="text-3xl font-bold text-primary">{userTrees.length}</div>
              <div className="text-sm text-muted-foreground">Trees Planted</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <div className="text-3xl font-bold text-accent-foreground">{totalHealthAvg}%</div>
              <div className="text-sm text-muted-foreground">Avg Health</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <div className="text-3xl font-bold text-secondary-foreground">
                {userTrees.reduce((sum, t) => sum + t.stewardshipScore, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </Card>
          </section>
        )}
        
        {/* Your Forest Snapshot */}
        {userTrees.length > 0 && (
          <section className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Your Forest Snapshot</h3>
              <p className="text-muted-foreground">Your thriving trees need your care</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTrees.map((tree) => (
                <TreeCard
                  key={tree.id}
                  tree={tree}
                  onWater={handleWater}
                  onChat={(id) => navigate(`/chat?treeId=${id}`)}
                  onTrade={(id) => navigate(`/trade`)}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Quick Actions */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/plant">
              <Card className="p-6 hover:shadow-medium transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sprout className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Plant a Tree</h4>
                <p className="text-sm text-muted-foreground">
                  Start your journey with a new tree
                </p>
              </Card>
            </Link>
            
            <Link to="/submit">
              <Card className="p-6 hover:shadow-medium transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-accent-foreground" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Submit Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Weekly photo update for your trees
                </p>
              </Card>
            </Link>
            
            <Link to="/chat">
              <Card className="p-6 hover:shadow-medium transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Chat with Sage</h4>
                <p className="text-sm text-muted-foreground">
                  Learn care tips from your AI companion
                </p>
              </Card>
            </Link>
            
            <Link to="/trade">
              <Card className="p-6 hover:shadow-medium transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-forest-earth/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6 text-forest-earth" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Marketplace</h4>
                <p className="text-sm text-muted-foreground">
                  Browse and trade TreeTokens
                </p>
              </Card>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border mt-20 bg-card/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Petri</span>
              <span className="text-sm text-muted-foreground">© 2025 All rights reserved</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">FAQ</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
