'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './shared-layout.css';

interface NavigationItem {
  path: string;
  icon: string;
  label: string;
  isDefault?: boolean;
  isEmergency?: boolean;
  isSettings?: boolean;
}

interface SharedLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = true 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showNavigation, setShowNavigation] = useState(false);

  const navigationItems: NavigationItem[] = [
    { path: '/voice-chat', icon: '🤖', label: 'AI Voice Chat', isDefault: true },
    { path: '/landing', icon: '🏠', label: 'Home' },
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/therapist-directory', icon: '👩‍⚕️', label: 'Find Therapist' },
    { path: '/peer-support', icon: '🤝', label: 'Peer Support' },
    { path: '/productivity-center', icon: '🎯', label: 'Productivity' },
    { path: '/crisis-support', icon: '🚨', label: 'Crisis Support', isEmergency: true },
    { path: '/settings', icon: '⚙️', label: 'Settings', isSettings: true }
  ];

  const currentPage = navigationItems.find(item => item.path === pathname);

  const navigateToPage = (path: string) => {
    router.push(path);
    setShowNavigation(false);
  };

  return (
    <div className="mindcure-layout">
      {/* Header */}
      <header className="layout-header">
        <div className="header-left">
          {showBackButton && pathname !== '/voice-chat' && pathname !== '/landing' && (
            <button className="back-button" onClick={() => router.push('/landing')}>
              ←
            </button>
          )}
          <h1 className="page-title">{title}</h1>
        </div>
        <div className="header-right">
          <button 
            className="nav-toggle"
            onClick={() => setShowNavigation(!showNavigation)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Navigation Overlay */}
      {showNavigation && (
        <div className="navigation-overlay" onClick={() => setShowNavigation(false)}>
          <div className="navigation-menu" onClick={(e) => e.stopPropagation()}>
            <div className="nav-header">
              <h3>Navigate</h3>
              <button className="nav-close" onClick={() => setShowNavigation(false)}>×</button>
            </div>
            <div className="nav-items">
              {navigationItems.map((item) => (
                <button 
                  key={item.path}
                  className={`nav-item ${currentPage?.path === item.path ? 'active' : ''} ${item.isEmergency ? 'crisis' : ''} ${item.isSettings ? 'settings' : ''}`}
                  onClick={() => navigateToPage(item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default SharedLayout;
