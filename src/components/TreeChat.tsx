import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { ChatMessage_AI, TreePersonality } from '@/types';
import { Send, Volume2, Loader2, MessageCircle, Leaf } from 'lucide-react';

interface TreeChatProps {
  treeId: number;
  treeName?: string;
  personality?: TreePersonality;
}

export const TreeChat = ({ treeId, treeName = 'Tree', personality }: TreeChatProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage_AI[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [includeAudio, setIncludeAudio] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await apiClient.getTreeChatHistory(treeId.toString());
        const typed = response as { messages?: ChatMessage_AI[] };
        if (typed && 'messages' in typed && Array.isArray(typed.messages)) {
          setMessages(typed.messages);
        }
      } catch (error) {
        // No history yet or error, that's fine
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [treeId]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setLoading(true);

    try {
      const response = await apiClient.chatWithTree(treeId.toString(), {
        content: userMessage,
        include_audio: includeAudio,
      });

      const typed = response as {
        user_message?: string;
        tree_response?: string;
        audio_url?: string;
      };

      if (typed && 'user_message' in typed) {
        // Add user message
        const userMsg: ChatMessage_AI = {
          id: Date.now(),
          tree_id: treeId,
          user_id: 0,
          role: 'user',
          content: typed.user_message,
          created_at: new Date().toISOString(),
        };

        // Add tree response
        const treeMsg: ChatMessage_AI = {
          id: Date.now() + 1,
          tree_id: treeId,
          user_id: 0,
          role: 'assistant',
          content: typed.tree_response,
          audio_url: typed.audio_url,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg, treeMsg]);

        // Play audio if available
        if (typed.audio_url && includeAudio) {
          playAudio(typed.audio_url);
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
      // Re-add user message on error
      setInputValue(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      toast({
        title: 'Audio Playback Error',
        description: 'Could not play tree response audio',
        variant: 'destructive',
      });
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!personality) {
    return (
      <Card className="p-6 bg-card/50 text-center text-muted-foreground">
        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>This tree hasn't developed a personality yet.</p>
        <p className="text-sm mt-1">The owner needs to set up a personality first!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 flex flex-col h-[500px]">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Chat with {personality.name}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 ml-auto">{personality.tone}</span>
      </div>

      <ScrollArea className="flex-1 mb-4 pr-4">
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-center text-muted-foreground">
              <div>
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start a conversation with {personality.name}!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary text-secondary-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  {message.audio_url && message.role === 'assistant' && (
                    <button
                      onClick={() => playAudio(message.audio_url!)}
                      className="mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-black/20 hover:bg-black/30 transition-colors"
                    >
                      <Volume2 className="w-3 h-3" />
                      Play
                    </button>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeAudio}
              onChange={(e) => setIncludeAudio(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              Include voice response
            </span>
          </label>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder={`Chat with ${personality.name}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            size="icon"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
