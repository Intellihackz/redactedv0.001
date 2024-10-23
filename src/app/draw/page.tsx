'use client'

import { useEffect, useState } from 'react';
import InfiniteCanvas2 from '@/components/NewCanvas';
import { wallet } from '@/utils/near-wallet';
import { LandingPage } from '@/components/landing-page';

export default function Home() {
  const [walletReady, setWalletReady] = useState(false);
  useEffect(() => {
    if (wallet) {
      wallet.startUp().then(() => {
        setWalletReady(true);
      });
    }
  }, []);

  if (!walletReady) {
    return <div><LandingPage /></div>;
  }

  return <InfiniteCanvas2 />;
}
