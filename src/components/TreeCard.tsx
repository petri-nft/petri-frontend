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
    <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 bg-card">
      <Link to={`/trees/${tree.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={latestPhoto?.url || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'}
            alt={tree.nickname || tree.species}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <HealthBadge healthIndex={tree.healthIndex} size="sm" />
          </div>
          {tree.listed && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              For Sale
            </Badge>
          )}
        </div>
      </Link>
      
      <div className="p-4 space-y-3">
        <div>
          <Link to={`/trees/${tree.id}`}>
            <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
              {tree.nickname || tree.species}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{tree.species}</p>
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
