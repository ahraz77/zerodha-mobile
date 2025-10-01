import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationHistory, setNavigationHistory] = useState([]);

  // Track navigation history with smart filtering
  useEffect(() => {
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      const currentPath = location.pathname;
      
      // Don't add duplicate consecutive entries
      if (newHistory.length === 0 || newHistory[newHistory.length - 1] !== currentPath) {
        // Skip adding certain paths that shouldn't be in back history
        const skipPaths = ['/login', '/signup', '/'];
        
        if (!skipPaths.includes(currentPath)) {
          newHistory.push(currentPath);
          
          // Keep only last 5 entries to prevent issues
          if (newHistory.length > 5) {
            newHistory.shift();
          }
        }
      }
      
      return newHistory;
    });
  }, [location.pathname]);

  const goBack = (fallbackPath = '/portfolio') => {
    const currentPath = location.pathname;
    
    // Define smart back navigation rules
    const navigationRules = {
      '/funds': '/portfolio',
      '/addfunds': '/portfolio?tab=funds',
      '/withdrawal': '/portfolio?tab=funds',
      '/profile': '/portfolio',
      '/settings': '/portfolio',
      '/invite-friends': '/portfolio',
    };

    // If there's a specific rule for this page, use it
    if (navigationRules[currentPath]) {
      navigate(navigationRules[currentPath]);
      return;
    }

    // Otherwise, try to go back in history
    if (navigationHistory.length > 1) {
      const previousPath = navigationHistory[navigationHistory.length - 2];
      
      // Avoid going back to problematic paths
      const avoidPaths = ['/login', '/signup', '/', '/addfunds', '/withdrawal'];
      if (avoidPaths.includes(previousPath)) {
        navigate(fallbackPath);
      } else {
        navigate(-1);
      }
    } else {
      // Fallback to provided path or portfolio
      navigate(fallbackPath);
    }
  };

  const goBackToSpecificPage = (targetPage) => {
    // For specific cases where we know where to go back
    navigate(targetPage);
  };

  const navigateToPage = (path) => {
    navigate(path);
  };

  const value = {
    goBack,
    goBackToSpecificPage,
    navigateToPage,
    navigationHistory,
    currentPath: location.pathname
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};