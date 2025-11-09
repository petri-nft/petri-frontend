import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        toast({
          title: 'Welcome back! 🌲',
          description: 'Successfully logged in',
        });
        navigate('/');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: result.error || 'Invalid credentials',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during login',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to Petri</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to tend your forest
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="alice"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Demo: alice / password123 or bob / password123
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="text-center space-y-2">
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
