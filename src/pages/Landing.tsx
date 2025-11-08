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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.15),transparent_50%)] pointer-events-none" />
      
      {/* Header */}
      <header className="border-b-2 border-primary/20 bg-card/80 backdrop-blur-md sticky top-0 z-40 shadow-medium">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow animate-glow-pulse">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Petri</h1>
              <p className="text-xs text-muted-foreground">🌲 Forest Keeper</p>
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
      
      <main className="container mx-auto px-4 py-8 space-y-12 relative z-10">
        {/* Hero */}
        <section className="text-center space-y-6 py-12 animate-fade-in-up">
          <Badge className="bg-gradient-to-r from-accent/30 to-primary/30 text-foreground border-accent/50 backdrop-blur-sm animate-bounce-in shadow-glow">
            🌱 Your Forest Journey Begins
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent max-w-3xl mx-auto animate-shimmer" style={{ backgroundSize: '200% auto' }}>
            Plant, Nurture, and Trade Living TreeTokens
          </h2>
          <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto">
            Every tree you plant becomes a <span className="text-primary font-semibold">dynamic token</span>. Learn AI-guided care from Sage, track
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
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/20 border-2 border-primary/40 hover:border-primary/60 transition-all duration-500 hover:shadow-glow group animate-fade-in">
              <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform">{userTrees.length}</div>
              <div className="text-sm text-muted-foreground">🌳 Trees Planted</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 border-2 border-accent/40 hover:border-accent/60 transition-all duration-500 hover:shadow-glow group animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-accent group-hover:scale-110 transition-transform">{totalHealthAvg}%</div>
              <div className="text-sm text-muted-foreground">💚 Avg Health</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/20 border-2 border-secondary/40 hover:border-secondary/60 transition-all duration-500 hover:shadow-glow group animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-secondary group-hover:scale-110 transition-transform">
                {userTrees.reduce((sum, t) => sum + t.stewardshipScore, 0)}
              </div>
              <div className="text-sm text-muted-foreground">⭐ Total Score</div>
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
            <Link to="/plant" className="animate-fade-in">
              <Card className="p-6 hover:shadow-strong transition-all duration-500 cursor-pointer group bg-gradient-to-br from-card to-card/50 border-2 border-border/50 hover:border-primary/50 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-glow">
                    <Sprout className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Plant a Tree</h4>
                  <p className="text-sm text-muted-foreground">
                    Start your journey with a new tree
                  </p>
                </div>
              </Card>
            </Link>
            
            <Link to="/submit" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Card className="p-6 hover:shadow-strong transition-all duration-500 cursor-pointer group bg-gradient-to-br from-card to-card/50 border-2 border-border/50 hover:border-accent/50 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-primary/10 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-glow">
                    <Camera className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">Submit Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Weekly photo update for your trees
                  </p>
                </div>
              </Card>
            </Link>
            
            <Link to="/chat" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Card className="p-6 hover:shadow-strong transition-all duration-500 cursor-pointer group bg-gradient-to-br from-card to-card/50 border-2 border-border/50 hover:border-secondary/50 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover:from-secondary/10 group-hover:to-accent/10 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-glow">
                    <MessageCircle className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">Chat with Sage</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn care tips from your AI companion
                  </p>
                </div>
              </Card>
            </Link>
            
            <Link to="/trade" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Card className="p-6 hover:shadow-strong transition-all duration-500 cursor-pointer group bg-gradient-to-br from-card to-card/50 border-2 border-border/50 hover:border-primary/50 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/50 to-accent flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-glow">
                    <Store className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Marketplace</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse and trade TreeTokens
                  </p>
                </div>
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
