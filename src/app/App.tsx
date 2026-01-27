import { useState, createContext, useContext } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { HomeFeed } from './components/HomeFeed';
import { WorkspacesList } from './components/WorkspacesList';
import { ResourcesHub } from './components/ResourcesHub';
import { NetworkMap } from './components/NetworkMap';
import { UserProfile } from './components/UserProfile';
import { BottomNav } from './components/BottomNav';

// App context for managing auth state
interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
    organization: string;
    avatar: string;
  } | null;
}

const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  currentUser: null,
});

export const useApp = () => useContext(AppContext);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');

  const currentUser = {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@foodsafer.com',
    organization: 'FoodSafe Global',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  };

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

  if (!isAuthenticated) {
    return (
      <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, currentUser: null }}>
        <div className="min-h-screen bg-white">
          <LoginScreen />
        </div>
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, currentUser }}>
      <div className={`min-h-screen bg-[#F5F5F5] ${activeTab !== 'profile' ? 'pb-20' : ''}`}>
        {renderScreen()}
        {activeTab !== 'profile' && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
    </AppContext.Provider>
  );
}