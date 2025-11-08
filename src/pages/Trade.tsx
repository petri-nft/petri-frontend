import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { TreeCard } from '@/components/TreeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Store, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Trade = () => {
  const navigate = useNavigate();
  const { user, trees, buyTree, listTreeForSale, unlistTree } = useStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHealth, setFilterHealth] = useState('all');
  const [sortBy, setSortBy] = useState<'price' | 'health' | 'newest'>('newest');
  
  const listedTrees = trees.filter(t => t.listed);
  const myListedTrees = listedTrees.filter(t => t.ownerId === user?.id);
  const othersListedTrees = listedTrees.filter(t => t.ownerId !== user?.id);
  
  // Filter and sort
  let filteredTrees = othersListedTrees.filter(tree => {
    const matchesSearch = tree.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.nickname?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesHealth = true;
    if (filterHealth === 'excellent') matchesHealth = tree.healthIndex >= 90;
    else if (filterHealth === 'good') matchesHealth = tree.healthIndex >= 70 && tree.healthIndex < 90;
    else if (filterHealth === 'fair') matchesHealth = tree.healthIndex < 70;
    
    return matchesSearch && matchesHealth;
  });
  
  filteredTrees.sort((a, b) => {
    if (sortBy === 'price') {
      return (a.price || 0) - (b.price || 0);
    } else if (sortBy === 'health') {
      return b.healthIndex - a.healthIndex;
    } else {
      return new Date(b.plantedAt).getTime() - new Date(a.plantedAt).getTime();
    }
  });
  
  const handleBuy = (treeId: string) => {
    const tree = trees.find(t => t.id === treeId);
    if (!tree) return;
    
    buyTree(treeId);
    toast({
      title: 'Purchase Complete! 🎉',
      description: `${tree.nickname || tree.species} is now yours!`,
    });
  };
  
  const handleUnlist = (treeId: string) => {
    unlistTree(treeId);
    toast({
      title: 'Unlisted',
      description: 'Your tree has been removed from the marketplace',
    });
  };
  
  const handleList = (treeId: string) => {
    const price = Math.floor(Math.random() * 100) + 50;
    listTreeForSale(treeId, price);
    toast({
      title: 'Listed! 💰',
      description: `Your tree is now on sale for $${price}`,
    });
  };
  
  const totalValue = myListedTrees.reduce((sum, t) => sum + (t.price || 0), 0);
  
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
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">TreeToken Marketplace</h1>
            <p className="text-muted-foreground mt-1">
              {othersListedTrees.length} trees available
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Simulated Trading</span>
          </div>
        </div>
        
        {/* My Listings */}
        {myListedTrees.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Your Listings</h2>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Total Value: ${totalValue}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListedTrees.map(tree => (
                <div key={tree.id} className="relative">
                  <TreeCard tree={tree} compact />
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => handleUnlist(tree.id)}
                  >
                    Remove Listing
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by species or nickname..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-input rounded-lg bg-background"
            >
              <option value="newest">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="health">Healthiest</option>
            </select>
            
            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg bg-background"
            >
              <option value="all">All Health</option>
              <option value="excellent">Excellent (90%+)</option>
              <option value="good">Good (70-89%)</option>
              <option value="fair">Fair (&lt;70%)</option>
            </select>
          </div>
        </div>
        
        {/* Browse Trees */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Available Trees</h2>
          
          {filteredTrees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrees.map(tree => (
                <div key={tree.id}>
                  <TreeCard tree={tree} />
                  <Button
                    className="w-full mt-2 bg-primary hover:bg-primary/90"
                    onClick={() => handleBuy(tree.id)}
                  >
                    Buy for ${tree.price}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Store className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No trees available
              </h3>
              <p className="text-muted-foreground">
                Check back later for new listings
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Trade;
