import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator && window.navigator.standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      return; // App is already installed
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // Listen for the app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show prompt after a delay if conditions are met
    const timer = setTimeout(() => {
      if (!isStandalone && !isInWebAppiOS) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mx-auto max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Install Kite App
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Add Kite to your home screen for quick access and a better experience.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 bg-gray-100 text-gray-700 text-xs font-medium py-2 px-3 rounded hover:bg-gray-200 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;