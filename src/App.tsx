import { useState, useEffect } from 'react';
import { initializeAppData } from './lib/storage';
import { Navigation } from './components/Navigation';
import { HomeTab } from './components/HomeTab';
import { ScanTab } from './components/ScanTab';
import { RoutineTab } from './components/RoutineTab';
import { ProductsTab } from './components/ProductsTab';
import { ProgressTab } from './components/ProgressTab';
import { ProfileTab } from './components/ProfileTab';

type Tab = 'home' | 'scan' | 'routine' | 'products' | 'progress' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initialize app data from localStorage
    initializeAppData();

    // Show splash screen for 2 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-600 to-teal-500 flex flex-col items-center justify-center">
        <div className="animate-fade-in">
          <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8">
            <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">iDermal AI</h1>
          <p className="text-teal-100 text-lg">Your Personal Skincare Coach</p>
        </div>
        <div className="absolute bottom-16 flex gap-2">
          <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onNavigate={(tab) => setActiveTab(tab)} />;
      case 'scan':
        return <ScanTab />;
      case 'routine':
        return <RoutineTab />;
      case 'products':
        return <ProductsTab />;
      case 'progress':
        return <ProgressTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {renderTab()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
