import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreePersonalityComponent } from '@/components/TreePersonalitySetup';
import { TreeChat } from '@/components/TreeChat';
import { TreePersonality } from '@/types';
import { Sparkles, MessageCircle } from 'lucide-react';

interface AIInteractionSectionProps {
  treeId: number;
  treeName: string;
  isOwner: boolean;
}

export const AIInteractionSection = ({
  treeId,
  treeName,
  isOwner,
}: AIInteractionSectionProps) => {
  const [personality, setPersonality] = useState<TreePersonality | null>(null);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="personality" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Personality
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personality" className="space-y-4">
          <TreePersonalityComponent
            treeId={treeId}
            onPersonalitySet={setPersonality}
            isOwner={isOwner}
          />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <TreeChat
            treeId={treeId}
            treeName={treeName}
            personality={personality}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
