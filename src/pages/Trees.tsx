import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { TreeCard } from '@/components/TreeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, SlidersHorizontal, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Trees = () => {
  const navigate = useNavigate();
  const { user, trees, waterTree, fetchTrees, isLoading } = useStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'health' | 'species'>('newest');
  const [filterSpecies, setFilterSpecies] = useState('');
  
  // Fetch trees on mount
  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);
  
  const handleWater = (treeId: string) => {
    waterTree(treeId);
    toast({
      title: 'Tree Watered! 💧',
      description: 'Your tree thanks you.',
    });
  };
  
  // Filter to user's trees - convert IDs to strings for comparison
  const userTrees = trees.filter(t => String(t.ownerId) === user?.id);
  
  // Filter and sort
  const filteredTrees = userTrees.filter(tree => {
    const matchesSearch = tree.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.species.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = !filterSpecies || tree.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });
  
  filteredTrees.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.plantedAt).getTime() - new Date(a.plantedAt).getTime();
    } else if (sortBy === 'health') {
      return b.healthIndex - a.healthIndex;
    } else {
      return a.species.localeCompare(b.species);
    }
  });
  
  const species = Array.from(new Set(userTrees.map(t => t.species)));
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Loading your forest...</p>
      </div>
    );
  }
  
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
            <h1 className="text-3xl font-bold text-foreground">Your Trees</h1>
            <p className="text-muted-foreground mt-1">
              {userTrees.length} tree{userTrees.length !== 1 ? 's' : ''} in your forest
            </p>
          </div>
          <Button onClick={() => navigate('/plant')} className="bg-primary hover:bg-primary/90">
            <Sprout className="w-4 h-4 mr-2" />
            Plant New
          </Button>
        </div>
        
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
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'health' | 'species')}
              className="px-4 py-2 border border-input rounded-lg bg-background"
            >
              <option value="newest">Newest First</option>
              <option value="health">Healthiest</option>
              <option value="species">Species (A-Z)</option>
            </select>
            
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg bg-background"
            >
              <option value="">All Species</option>
              {species.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          {(searchQuery || filterSpecies) && (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="ml-1">×</button>
                </Badge>
              )}
              {filterSpecies && (
                <Badge variant="secondary" className="gap-1">
                  {filterSpecies}
                  <button onClick={() => setFilterSpecies('')} className="ml-1">×</button>
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* Trees Grid */}
        {filteredTrees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrees.map(tree => (
              <TreeCard
                key={tree.id}
                tree={tree}
                onWater={handleWater}
                onChat={(id) => navigate(`/chat?treeId=${id}`)}
                onTrade={() => navigate('/trade')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Sprout className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {userTrees.length === 0 ? 'No trees yet' : 'No matching trees'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {userTrees.length === 0
                ? 'Start your forest journey by planting your first tree'
                : 'Try adjusting your filters'}
            </p>
            {userTrees.length === 0 && (
              <Button onClick={() => navigate('/plant')} className="bg-primary hover:bg-primary/90">
                <Sprout className="w-4 h-4 mr-2" />
                Plant Your First Tree
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Trees;
