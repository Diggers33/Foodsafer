import { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { HomeFeed } from './components/HomeFeed';
import { WorkspacesList } from './components/WorkspacesList';
import { ResourcesHub } from './components/ResourcesHub';
import { NetworkMap } from './components/NetworkMap';
import { UserProfile } from './components/UserProfile';
import { BottomNav } from './components/BottomNav';
import { User, authService, getAccessToken, clearTokens, onAuthStateChange } from '@/api';
import { Loader2 } from 'lucide-react';

// App context for managing auth state
interface AppContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  currentUser: null,
  isLoading: true,
  login: () => {},
  logout: async () => {},
});

export const useApp = () => useContext(AppContext);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch {
          // Token is invalid or expired, clear it
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Listen for auth state changes (e.g., when tokens are cleared due to session expiry)
  useEffect(() => {
    const unsubscribe = onAuthStateChange((authenticated) => {
      if (!authenticated) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setActiveTab('home');
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if logout fails on server, clear local state
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('home');
  }, []);

  const handleProfileClick = () => {
    setPreviousTab(activeTab);
    setActiveTab('profile');
  };

  const handleBackFromProfile = () => {
    setActiveTab(previousTab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed onProfileClick={handleProfileClick} />;
      case 'workspaces':
        return <WorkspacesList onProfileClick={handleProfileClick} />;
      case 'resources':
        return <ResourcesHub onProfileClick={handleProfileClick} />;
      case 'network':
        return <NetworkMap onProfileClick={handleProfileClick} />;
      case 'profile':
        return <UserProfile onBack={handleBackFromProfile} />;
      default:
        return <HomeFeed onProfileClick={handleProfileClick} />;
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppContext.Provider value={{ isAuthenticated, currentUser, isLoading, login, logout }}>
        <div className="min-h-screen bg-white">
          <LoginScreen />
        </div>
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ isAuthenticated, currentUser, isLoading, login, logout }}>
      <div className={`min-h-screen bg-[#F5F5F5] ${activeTab !== 'profile' ? 'pb-20' : ''}`}>
        {renderScreen()}
        {activeTab !== 'profile' && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
    </AppContext.Provider>
  );
}
