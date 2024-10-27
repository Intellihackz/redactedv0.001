'use client'
import { useEffect, useState } from 'react';
import NewCanvas from '@/components/NewCanvas';
import { wallet } from '@/utils/near-wallet';
import LoadingPage from '@/components/LoadingPage';

export default function Draw() {
  const [walletReady, setWalletReady] = useState(false);
  // const [isDarkMode, setIsDarkMode] = useState(true); // You can adjust this based on your app's theme state

  useEffect(() => {
    if (wallet) {
      wallet.startUp().then(() => {
        setWalletReady(true);
      });
    }
  }, []);

  if (!walletReady) {
    return <LoadingPage isDarkMode={true} />;
  }

  return (
    <div>
      <NewCanvas />
    </div>
  );
}
