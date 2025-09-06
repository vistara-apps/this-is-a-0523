import { useState, useEffect } from 'react';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState({
    type: 'free', // 'free' or 'pro'
    expiresAt: null
  });
  
  const [scansUsed, setScansUsed] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jobmatch-subscription');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubscription(parsed.subscription);
        setScansUsed(parsed.scansUsed);
      } catch (error) {
        console.error('Failed to parse saved subscription:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const data = {
      subscription,
      scansUsed
    };
    localStorage.setItem('jobmatch-subscription', JSON.stringify(data));
  }, [subscription, scansUsed]);

  const incrementScans = () => {
    if (subscription.type === 'free') {
      setScansUsed(prev => Math.min(prev + 1, 3));
    }
    // Pro users don't have scan limits
  };

  const upgradeToPro = () => {
    setSubscription({
      type: 'pro',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    
    // Reset scan count for pro users (though it doesn't matter)
    setScansUsed(0);
  };

  const resetToFree = () => {
    setSubscription({
      type: 'free',
      expiresAt: null
    });
    setScansUsed(0);
  };

  return {
    subscription,
    scansUsed,
    incrementScans,
    upgradeToPro,
    resetToFree
  };
};