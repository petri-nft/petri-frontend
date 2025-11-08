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
    <Card className="overflow-hidden hover:shadow-strong hover:-translate-y-2 transition-all duration-500 bg-card group border-border hover:border-primary/50">
      <Link to={`/trees/${tree.id}`}>
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
          <img
            src={latestPhoto?.url || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'}
            alt={tree.nickname || tree.species}
            className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-3 right-3 transform group-hover:scale-110 transition-transform duration-300">
            <HealthBadge healthIndex={tree.healthIndex} size="sm" />
          </div>
          {tree.listed && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground animate-pulse-soft">
              For Sale
            </Badge>
          )}
        </div>
      </Link>
      
      <div className="p-4 space-y-3">
        <div>
          <Link to={`/trees/${tree.id}`}>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
              {tree.nickname || tree.species}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{tree.species}</p>
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
          <Badge variant="secondary" className="bg-secondary/50">
            Care: {tree.careIndex}
          </Badge>
          <Badge variant="secondary" className="bg-accent/50">
            Score: {tree.stewardshipScore}
          </Badge>
        </div>
        
        {!compact && (
          <div className="flex gap-2 pt-2">
            {onWater && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 group/btn hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  onWater(tree.id);
                }}
              >
                <Droplet className="w-3.5 h-3.5 mr-1 group-hover/btn:scale-110 group-hover/btn:text-primary transition-all duration-300" />
                Water
              </Button>
            )}
            {onChat && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 group/btn hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  onChat(tree.id);
                }}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1 group-hover/btn:scale-110 group-hover/btn:text-accent-foreground transition-all duration-300" />
                Chat
              </Button>
            )}
            {onTrade && tree.listed && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 group/btn hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  onTrade(tree.id);
                }}
              >
                <Store className="w-3.5 h-3.5 mr-1 group-hover/btn:scale-110 group-hover/btn:text-secondary-foreground transition-all duration-300" />
                ${tree.price}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
