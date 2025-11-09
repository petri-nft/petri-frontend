import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { TreePersonality, ElevenLabsVoice } from '@/types';
import { Sparkles, Loader2 } from 'lucide-react';

interface TreePersonalityProps {
  treeId: number;
  onPersonalitySet: (personality: TreePersonality) => void;
  isOwner: boolean;
}

const PERSONALITY_TONES = [
  { value: 'humorous', label: '😄 Humorous - Funny and witty' },
  { value: 'wise', label: '🧙 Wise - Thoughtful and knowledgeable' },
  { value: 'educational', label: '📚 Educational - Teaching-focused' },
  { value: 'poetic', label: '✨ Poetic - Artistic and lyrical' },
  { value: 'sarcastic', label: '😏 Sarcastic - Clever and ironic' },
  { value: 'enthusiastic', label: '🎉 Enthusiastic - Energetic and positive' },
];

const EXAMPLE_PERSONALITIES = [
  {
    name: 'Wise Oak',
    tone: 'wise',
    background: 'An ancient oak who has seen centuries pass. Loves sharing wisdom about patience and growth.',
  },
  {
    name: 'Cheeky Pine',
    tone: 'humorous',
    background: 'A playful pine tree with a great sense of humor. Always making jokes about branches and needles.',
  },
  {
    name: 'Professor Birch',
    tone: 'educational',
    background: 'A scholarly birch tree passionate about teaching others about photosynthesis and ecosystems.',
  },
  {
    name: 'Poetic Maple',
    tone: 'poetic',
    background: 'A romantic maple tree who expresses life through beautiful metaphors and seasonal reflections.',
  },
];

export const TreePersonalityComponent = ({
  treeId,
  onPersonalitySet,
  isOwner,
}: TreePersonalityProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState<TreePersonality | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    tone: 'humorous',
    background: '',
    traits: {} as Record<string, string | number | boolean>,
  });

  // Load current personality
  useEffect(() => {
    const loadPersonality = async () => {
      try {
        const response = await apiClient.getTreePersonality(treeId.toString());
        const typed = response as TreePersonality;
        if (typed && 'id' in typed) {
          setCurrentPersonality(typed);
          // CRITICAL: Call the callback to update parent component state
          onPersonalitySet(typed);
          setFormData({
            name: typed.name,
            tone: typed.tone,
            background: typed.background,
            traits: typed.traits,
          });
        }
      } catch (error) {
        // No personality set yet, which is fine
      }
    };

    const loadVoices = async () => {
      try {
        const response = await apiClient.getAvailableVoices();
        const typed = response as { voices: ElevenLabsVoice[] };
        if (typed && 'voices' in typed) {
          setVoices(typed.voices);
        }
      } catch (error) {
        console.error('Error loading voices:', error);
      }
    };

    loadPersonality();
    loadVoices();
  }, [treeId, onPersonalitySet]);

  const handleSavePersonality = async () => {
    if (!formData.name.trim() || !formData.background.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in name and background',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.setTreePersonality(treeId.toString(), {
        name: formData.name,
        tone: formData.tone,
        background: formData.background,
        traits: formData.traits,
      });

      toast({
        title: '🎉 Personality Set!',
        description: `${formData.name} is ready to chat!`,
      });

      setCurrentPersonality(response as TreePersonality);
      setIsEditing(false);
      onPersonalitySet(response as TreePersonality);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to set personality',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyExample = (example: (typeof EXAMPLE_PERSONALITIES)[0]) => {
    setFormData({
      name: example.name,
      tone: example.tone,
      background: example.background,
      traits: {},
    });
  };

  if (!isOwner) {
    return (
      <Card className="p-6 bg-card/50">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 mt-1 text-primary" />
          <div>
            {currentPersonality ? (
              <>
                <h3 className="font-semibold mb-2">{currentPersonality.name}</h3>
                <p className="text-sm text-muted-foreground">{currentPersonality.background}</p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-medium">
                  Tone: {currentPersonality.tone}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">This tree doesn't have a personality set yet.</p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (!isEditing && currentPersonality) {
    return (
      <Card className="p-6 bg-card/50">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {currentPersonality.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{currentPersonality.background}</p>
            <div className="flex gap-2 flex-wrap">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-medium">
                Tone: {currentPersonality.tone}
              </div>
              {currentPersonality.voice_id && (
                <div className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-xs font-medium">
                  🎤 Voice Enabled
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
          >
            Edit
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        {isEditing ? 'Edit Personality' : 'Create Tree Personality'}
      </h3>

      <div className="space-y-4">
        {/* Quick Examples */}
        {!isEditing && !currentPersonality && (
          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block">Or choose a template:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_PERSONALITIES.map((example) => (
                <button
                  key={example.name}
                  onClick={() => applyExample(example)}
                  className="text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="font-medium text-sm">{example.name}</div>
                  <div className="text-xs text-muted-foreground">{example.tone}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Name Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Tree Name/Personality</label>
          <Input
            placeholder="e.g., Wise Oak, Cheeky Pine, Professor Birch"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Tone Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Personality Tone</label>
          <Select value={formData.tone} onValueChange={(tone) => setFormData({ ...formData, tone })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERSONALITY_TONES.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Background Story */}
        <div>
          <label className="text-sm font-medium mb-2 block">Background & Story</label>
          <Textarea
            placeholder="Describe your tree's personality, backstory, interests, and unique traits..."
            value={formData.background}
            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This helps the AI understand how to respond as your tree!
          </p>
        </div>

        {/* Additional Traits */}
        <div>
          <label className="text-sm font-medium mb-2 block">Additional Traits (Optional)</label>
          <div className="space-y-2">
            <Input
              placeholder="Favorite color, food, activity, etc. (Optional)"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  setFormData({
                    ...formData,
                    traits: { ...formData.traits, favorite_thing: e.target.value },
                  });
                }
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSavePersonality}
            disabled={loading || !formData.name.trim()}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting Up...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {currentPersonality ? 'Update Personality' : 'Create Personality'}
              </>
            )}
          </Button>
          {isEditing && (
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Export with both names for compatibility
export const TreePersonalitySetup = TreePersonalityComponent;

