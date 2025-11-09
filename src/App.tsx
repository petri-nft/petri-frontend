import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useStore } from "./store/useStore";
import { apiClient } from "./lib/api";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PlantTree from "./pages/PlantTree";
import Trees from "./pages/Trees";
import TreeDetail from "./pages/TreeDetail";
import Submit from "./pages/Submit";
import Chat from "./pages/Chat";
import Trade from "./pages/Trade";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { setUser, fetchTrees, user, login } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userJson = localStorage.getItem('user');
        
        if (token && userJson) {
          const savedUser = JSON.parse(userJson);
          apiClient.setToken(token);
          setUser(savedUser);
          // Fetch trees for the restored user
          await fetchTrees();
        } else {
          // Auto-login with test credentials for development
          console.log('No session found, attempting auto-login...');
          const result = await login('alice', 'password123');
          if (!result.success) {
            console.warn('Auto-login failed:', result.error);
          } else {
            console.log('Auto-login successful');
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        // Clear invalid stored data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setIsInitialized(true);
      }
    };
    
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount only

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
          <p className="mt-4 text-muted-foreground">Loading your forest...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Landing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plant"
              element={
                <ProtectedRoute>
                  <PlantTree />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trees"
              element={
                <ProtectedRoute>
                  <Trees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trees/:id"
              element={
                <ProtectedRoute>
                  <TreeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit"
              element={
                <ProtectedRoute>
                  <Submit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trade"
              element={
                <ProtectedRoute>
                  <Trade />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <AppContent />
);

export default App;
