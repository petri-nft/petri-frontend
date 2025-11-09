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
  Leaf,
  TrendingUp,
  Shield,
  Zap,
  Award,
  ArrowRight,
  CheckCircle,
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
  
  const userTrees = trees.filter(t => String(t.ownerId) === user?.id);
  const totalHealthAvg = userTrees.length > 0
    ? Math.round(userTrees.reduce((sum, t) => sum + t.healthIndex, 0) / userTrees.length)
    : 0;

  const features = [
    {
      icon: Sprout,
      title: "Plant & Mint",
      description: "Transform real trees into dynamic TreeTokens with live camera verification and unique digital identity.",
      color: "primary"
    },
    {
      icon: MessageCircle,
      title: "AI-Powered Care",
      description: "Learn from Sage, your witty AI companion, with personalized lessons and real-time guidance.",
      color: "accent"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Health Tracking",
      description: "Monitor NDVI data, health indices, and growth patterns with beautiful visual analytics.",
      color: "secondary"
    },
    {
      icon: Store,
      title: "Trade & Fractional Ownership",
      description: "Buy, sell, and own fractional shares of TreeTokens in a transparent marketplace.",
      color: "forest-earth"
    },
    {
      icon: Award,
      title: "Stewardship Rewards",
      description: "Earn badges and increase your stewardship score through consistent care and education.",
      color: "leaf"
    },
    {
      icon: Shield,
      title: "Verified Impact",
      description: "Every action is logged with timestamps and photos, creating an immutable care history.",
      color: "mint"
    }
  ];

  const steps = [
    { step: "01", title: "Plant Your Tree", desc: "Capture a photo and register your tree with species details" },
    { step: "02", title: "Learn & Care", desc: "Chat with Sage for AI-guided lessons on optimal care" },
    { step: "03", title: "Track Health", desc: "Weekly photo submissions monitor health index and growth" },
    { step: "04", title: "Trade & Earn", desc: "List your TreeToken or buy shares in thriving forests" }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur-xl sticky top-0 z-50 animate-fade-in-down shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-float-slow group-hover:animate-float transition-all duration-300 shadow-md">
              <Sprout className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Petri</h1>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Forest Keeper</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">How It Works</a>
            <a href="#your-forest" className="text-muted-foreground hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">Your Forest</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="hover:rotate-12 transition-transform duration-300">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:-rotate-12 transition-transform duration-300">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="container mx-auto px-4 text-center relative">
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30 mb-6 animate-bounce-in hover:scale-110 transition-transform duration-300 cursor-default">
              🌱 The Future of Forest Stewardship
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold text-foreground max-w-5xl mx-auto mb-6 animate-fade-in-up leading-tight">
              Plant, Nurture, and Trade Living{' '}
              <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">TreeTokens</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              Transform real trees into dynamic digital assets. Learn AI-guided care from Sage, track health with real data, and trade fractional ownership in a transparent marketplace.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/plant">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 group shadow-lg hover:shadow-xl">
                  <Sprout className="w-5 h-5 mr-2 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  Plant Your First Tree
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-all duration-300" />
                </Button>
              </Link>
              <Link to="/trees">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 group shadow-md hover:shadow-lg">
                  <Trees className="w-5 h-5 mr-2 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-300" />
                  Explore Your Forest
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {userTrees.length > 0 && (
          <section id="your-forest" className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 hover:shadow-strong transition-all duration-300 animate-scale-in group">
                  <div className="text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">{userTrees.length}</div>
                  <div className="text-sm text-muted-foreground">Trees Planted</div>
                  <Leaf className="w-8 h-8 text-primary/30 mt-4" />
                </Card>
                <Card className="p-8 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 hover:shadow-strong transition-all duration-300 animate-scale-in group" style={{ animationDelay: '0.1s' }}>
                  <div className="text-5xl font-bold text-accent-foreground mb-2 group-hover:scale-110 transition-transform">{totalHealthAvg}%</div>
                  <div className="text-sm text-muted-foreground">Average Health</div>
                  <TrendingUp className="w-8 h-8 text-accent/30 mt-4" />
                </Card>
                <Card className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30 hover:shadow-strong transition-all duration-300 animate-scale-in group" style={{ animationDelay: '0.2s' }}>
                  <div className="text-5xl font-bold text-secondary-foreground mb-2 group-hover:scale-110 transition-transform">
                    {userTrees.reduce((sum, t) => sum + t.stewardshipScore, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Stewardship Score</div>
                  <Award className="w-8 h-8 text-secondary/30 mt-4" />
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up">
              <Badge className="bg-primary/10 text-primary border-primary/30 mb-4">Features</Badge>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Everything You Need to Grow Your Forest
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools for planting, nurturing, tracking, and trading your living TreeTokens.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, idx) => (
                <Card 
                  key={idx}
                  className="p-8 hover:shadow-strong hover:-translate-y-3 transition-all duration-500 cursor-pointer group border-border/50 hover:border-primary/30 animate-fade-in-up bg-gradient-to-br from-card to-card/50"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-lg`}>
                    <feature.icon className={`w-8 h-8 text-${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up">
              <Badge className="bg-accent/10 text-accent-foreground border-accent/30 mb-4">How It Works</Badge>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Four Simple Steps to Forest Ownership
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From planting to trading, we've made every step intuitive and rewarding.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {steps.map((step, idx) => (
                <Card 
                  key={idx}
                  className="p-8 hover:shadow-strong hover:translate-x-2 transition-all duration-500 group border-l-4 border-primary/50 hover:border-primary animate-slide-in-left bg-gradient-to-r from-card to-primary/5"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <div className="flex items-start gap-6">
                    <div className="text-6xl font-bold text-primary/20 group-hover:text-primary/60 group-hover:scale-110 transition-all duration-500">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h4>
                      <p className="text-muted-foreground text-lg group-hover:text-foreground transition-colors duration-300">
                        {step.desc}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Your Trees Snapshot */}
        {userTrees.length > 0 && (
          <section className="py-20 md:py-32">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12 animate-fade-in-up">
                <h3 className="text-4xl font-bold text-foreground mb-3">Your Forest Snapshot</h3>
                <p className="text-lg text-muted-foreground">Your thriving trees need your care and attention</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userTrees.map((tree, idx) => (
                  <div 
                    key={tree.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <TreeCard
                      tree={tree}
                      onWater={handleWater}
                      onChat={(id) => navigate(`/chat?treeId=${id}`)}
                      onTrade={(id) => navigate(`/trade`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in-up">
              <h3 className="text-4xl font-bold text-foreground mb-3">Quick Actions</h3>
              <p className="text-lg text-muted-foreground">Jump right into forest stewardship</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <Link to="/plant" className="animate-scale-in">
                <Card className="p-8 hover:shadow-strong transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-lg">
                    <Sprout className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Plant a Tree</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Start your journey with a new tree
                  </p>
                </Card>
              </Link>
              
              <Link to="/submit" className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <Card className="p-8 hover:shadow-strong transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 border-border/50 hover:border-accent/50 bg-gradient-to-br from-card to-accent/5">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-lg">
                    <Camera className="w-8 h-8 text-accent-foreground group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent-foreground transition-colors">Submit Progress</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Weekly photo update for your trees
                  </p>
                </Card>
              </Link>
              
              <Link to="/chat" className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <Card className="p-8 hover:shadow-strong transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 border-border/50 hover:border-secondary/50 bg-gradient-to-br from-card to-secondary/5">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-lg">
                    <MessageCircle className="w-8 h-8 text-secondary-foreground group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2 group-hover:text-secondary-foreground transition-colors">Chat with Sage</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Learn care tips from your AI companion
                  </p>
                </Card>
              </Link>
              
              <Link to="/trade" className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <Card className="p-8 hover:shadow-strong transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 border-border/50 hover:border-forest-earth/50 bg-gradient-to-br from-card to-forest-earth/5">
                  <div className="w-16 h-16 rounded-2xl bg-forest-earth/10 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-lg">
                    <Store className="w-8 h-8 text-forest-earth group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2 group-hover:text-forest-earth transition-colors">Marketplace</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Browse and trade TreeTokens
                  </p>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <Card className="p-12 md:p-16 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 animate-fade-in-up">
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Ready to Grow Your Forest?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of forest keepers nurturing trees and earning rewards through sustainable stewardship.
              </p>
              <Link to="/plant">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-10 py-7 group">
                  <Sprout className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                  Plant Your First Tree Today
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border bg-card/30 animate-fade-in-up">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sprout className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-foreground text-lg">Petri</span>
                <p className="text-xs text-muted-foreground">© 2025 All rights reserved</p>
              </div>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Features</a>
              <a href="#" className="hover:text-primary transition-colors">FAQ</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
