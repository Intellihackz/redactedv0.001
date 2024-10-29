'use client'
import { useEffect, useState } from 'react';
import NewCanvas from '@/components/NewCanvas';
import LoadingPage from '@/components/LoadingPage';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import "@near-wallet-selector/modal-ui/styles.css";

export default function Draw() {
  const { selector, accountId } = useWalletSelector();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkSignIn = async () => {
      try {
        const signedIn: boolean = await selector.isSignedIn();
        setIsReady(true);
      } catch (error) {
        console.error("Error checking sign in status:", error);
        setIsReady(true); // Set ready even on error to avoid infinite loading
      }
    };
    
    checkSignIn();
  }, [selector]);

  if (!isReady) {
    return <LoadingPage isDarkMode={true} />;
  }

  return (
    <div className="flex h-screen">
      <NewCanvas />
    </div>
  );
}
