import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, discard it

    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-4 flex flex-col gap-3 relative dark:bg-zinc-900/90 dark:border-zinc-800">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X size={16} className="text-zinc-500" />
        </button>
        
        <div className="flex items-center gap-4 pr-6">
           {/* Placeholder for icon if needed, or just text */}
           <div className="bg-coral-500/10 p-2 rounded-xl">
             <img src="/logo.png" alt="App Icon" className="w-10 h-10 object-contain" />
           </div>
           <div>
             <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Install Hotel Lee App</h3>
             <p className="text-sm text-zinc-600 dark:text-zinc-400">Get the best experience with our app.</p>
           </div>
        </div>

        <button
          onClick={handleInstallClick}
          className="w-full py-2.5 px-4 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-medium rounded-xl shadow-lg shadow-coral-500/20 active:scale-[0.98] transition-all transform duration-200"
        >
          Install Now
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
