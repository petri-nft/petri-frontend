import { Tree } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HealthBadge } from './HealthBadge';
import { Badge } from '@/components/ui/badge';
import { Droplet, MessageCircle, Store, MapPin, Calendar } from 'lucide-react';
import { getRelativeTime, formatDate } from '@/lib/utils/helpers';
import { Link } from 'react-router-dom';

interface TreeCardProps {
  tree: Tree;
  onWater?: (treeId: string) => void;
  onChat?: (treeId: string) => void;
  onTrade?: (treeId: string) => void;
  compact?: boolean;
}

export const TreeCard = ({ tree, onWater, onChat, onTrade, compact = false }: TreeCardProps) => {
  const latestPhoto = tree.photos[tree.photos.length - 1];
  const lastWatered = tree.lastWateredAt ? getRelativeTime(tree.lastWateredAt) : 'Never';
  
  return (
    <Card className="group overflow-hidden hover:shadow-strong transition-all duration-500 bg-gradient-to-br from-card to-card/50 border-2 border-border/50 hover:border-primary/50 relative animate-fade-in-up hover:scale-[1.02]">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:via-accent/5 group-hover:to-primary/10 transition-all duration-500 pointer-events-none rounded-lg" />
      
      <Link to={`/trees/${tree.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={latestPhoto?.url || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'}
            alt={tree.nickname || tree.species}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-3 right-3 animate-bounce-in">
            <HealthBadge healthIndex={tree.healthIndex} size="sm" />
          </div>
          {tree.listed && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground animate-glow-pulse border border-primary/50">
              For Sale
            </Badge>
          )}
        </div>
      </Link>
      
      <div className="p-4 space-y-3 relative z-10">
        <div>
          <Link to={`/trees/${tree.id}`}>
            <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-all duration-300 group-hover:translate-x-1">
              {tree.nickname || tree.species}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground/80">{tree.species}</p>
        </div>
        
        {tree.location?.label && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{tree.location.label}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5" />
            <span>Last: {lastWatered}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(tree.plantedAt)}</span>
          </div>
        </div>
        
        <div className="flex gap-1.5 text-xs">
          <Badge variant="secondary" className="bg-gradient-to-r from-secondary/30 to-secondary/50 border border-secondary/30 backdrop-blur-sm">
            🌱 {tree.careIndex}
          </Badge>
          <Badge variant="secondary" className="bg-gradient-to-r from-accent/30 to-accent/50 border border-accent/30 backdrop-blur-sm">
            ⭐ {tree.stewardshipScore}
          </Badge>
        </div>
        
        {!compact && (
          <div className="flex gap-2 pt-2">
            {onWater && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  onWater(tree.id);
                }}
              >
                <Droplet className="w-3.5 h-3.5 mr-1" />
                Water
              </Button>
            )}
            {onChat && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  onChat(tree.id);
                }}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1" />
                Chat
              </Button>
            )}
            {onTrade && tree.listed && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  onTrade(tree.id);
                }}
              >
                <Store className="w-3.5 h-3.5 mr-1" />
                ${tree.price}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
