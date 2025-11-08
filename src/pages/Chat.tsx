import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { LessonCard } from '@/components/LessonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { mockLessons } from '@/lib/mockData';
import { generateId } from '@/lib/utils/helpers';
import { ChatMessage } from '@/types';
import { useToast } from '@/hooks/use-toast';

const SAGE_RESPONSES = [
  "Ah, a curious forest keeper! Let me check on that...",
  "Well, well... *rustles leaves thoughtfully*",
  "Interesting question! Here's what I think...",
  "Oh, you're doing great! Here's a tip:",
  "*adjusts moss beard* Good question!",
];

const SAGE_ADVICE = {
  watering: "Water deeply but less frequently. The soil should be moist 2-3 inches down. Morning is best!",
  mulch: "Keep 2-4 inches of mulch around the base, but 6 inches away from the trunk to prevent rot.",
  pests: "Check leaves regularly. Natural neem oil works wonders for most pests!",
  health: "Your tree looks healthy! Keep up the consistent care and it'll thrive.",
  default: "Trees are living beings that respond to consistent, patient care. Keep observing and learning!",
};

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, trees, chatMessages, addChatMessage, completeLesson } = useStore();
  const { toast } = useToast();
  
  const treeId = searchParams.get('treeId');
  const [selectedTreeId, setSelectedTreeId] = useState(treeId || '');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showLesson, setShowLesson] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(mockLessons[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const userTrees = trees.filter(t => t.ownerId === user?.id);
  const selectedTree = trees.find(t => t.id === selectedTreeId);
  
  useEffect(() => {
    if (treeId) {
      setSelectedTreeId(treeId);
    }
  }, [treeId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMsg: ChatMessage = {
        id: generateId(),
        from: 'sage',
        text: "Hey there, forest keeper! 🌿 I'm Sage, your slightly sarcastic but totally helpful tree companion. Ask me anything about caring for your trees, or I can start a quick lesson!",
        createdAt: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  }, []);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = {
      id: generateId(),
      from: 'user',
      text: input,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    addChatMessage(userMsg);
    
    // Determine response
    const lowerInput = input.toLowerCase();
    let response = SAGE_RESPONSES[Math.floor(Math.random() * SAGE_RESPONSES.length)] + " ";
    
    if (lowerInput.includes('water')) {
      response += SAGE_ADVICE.watering;
    } else if (lowerInput.includes('mulch')) {
      response += SAGE_ADVICE.mulch;
    } else if (lowerInput.includes('pest')) {
      response += SAGE_ADVICE.pests;
    } else if (lowerInput.includes('health') || lowerInput.includes('sick')) {
      response += SAGE_ADVICE.health;
    } else if (lowerInput.includes('lesson') || lowerInput.includes('learn') || lowerInput.includes('teach')) {
      response = "Perfect timing! I've got a great lesson queued up for you. Ready to learn?";
      setTimeout(() => {
        const lesson = selectedTree
          ? mockLessons.find(l => l.speciesTag === selectedTree.species) || mockLessons[0]
          : mockLessons[Math.floor(Math.random() * mockLessons.length)];
        setCurrentLesson(lesson);
        setShowLesson(true);
      }, 1000);
    } else {
      response += SAGE_ADVICE.default;
    }
    
    setTimeout(() => {
      const sageMsg: ChatMessage = {
        id: generateId(),
        from: 'sage',
        text: response,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, sageMsg]);
      addChatMessage(sageMsg);
    }, 800);
    
    setInput('');
  };
  
  const handleCompleteLesson = (lessonId: string, correct: boolean) => {
    if (selectedTreeId) {
      completeLesson(selectedTreeId, lessonId);
    }
    toast({
      title: correct ? 'Excellent! 🎉' : 'Good Try! 📚',
      description: correct ? '+5 Stewardship Score' : 'Keep learning!',
    });
    setShowLesson(false);
  };
  
  const quickReplies = [
    'How often should I water?',
    'What about mulching?',
    'Help with pests',
    'Start a lesson',
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            {userTrees.length > 1 && !treeId && (
              <select
                value={selectedTreeId}
                onChange={(e) => setSelectedTreeId(e.target.value)}
                className="px-3 py-1.5 text-sm border border-input rounded-lg bg-background"
              >
                <option value="">General Chat</option>
                {userTrees.map((tree) => (
                  <option key={tree.id} value={tree.id}>
                    {tree.nickname || tree.species}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Sage Header */}
        <Card className="p-4 mb-6 bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Sage</h2>
              <p className="text-sm text-muted-foreground">Your AI Tree Companion</p>
            </div>
            {selectedTree && (
              <Badge variant="secondary" className="ml-auto">
                {selectedTree.nickname || selectedTree.species}
              </Badge>
            )}
          </div>
        </Card>
        
        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  msg.from === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </Card>
            </div>
          ))}
          
          {showLesson && (
            <div className="mt-6">
              <LessonCard
                lesson={currentLesson}
                onComplete={handleCompleteLesson}
              />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Replies */}
        {!showLesson && (
          <div className="flex flex-wrap gap-2 mb-4">
            {quickReplies.map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(reply);
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        )}
      </main>
      
      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <div className="flex gap-2">
            <Input
              placeholder="Ask Sage anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
