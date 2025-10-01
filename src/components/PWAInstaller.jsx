import { useEffect } from 'react';

const PWAInstaller = () => {
  useEffect(() => {
    let deferredPrompt;
    const addBtn = document.getElementById('add-button');

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt Event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show the install button or banner
      showInstallPromotion();
    });

    // Handle the app installed event
    window.addEventListener('appinstalled', (evt) => {
      console.log('App was installed');
      hideInstallPromotion();
    });

    const showInstallPromotion = () => {
      // You can show a custom install banner here
      console.log('PWA can be installed');
    };

    const hideInstallPromotion = () => {
      // Hide install promotion
      console.log('PWA install promotion hidden');
    };

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is running in standalone mode');
    }

    // Handle install button click
    const handleInstallClick = async () => {
      if (deferredPrompt) {
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // Clear the deferredPrompt
        deferredPrompt = null;
      }
    };

    // Store the handler for potential use
    window.handlePWAInstall = handleInstallClick;

  }, []);

  return null; // This component doesn't render anything
};

export default PWAInstaller;