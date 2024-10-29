"use client";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";
import type { WalletSelector, AccountState, WalletModuleFactory } from "@near-wallet-selector/core";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { distinctUntilChanged, map } from "rxjs";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";

export interface WalletSelectorContextValue {
  selector: WalletSelector;
  modal: ReturnType<typeof setupModal>;
  accounts: Array<AccountState>;
  accountId: string | null;
}

const WalletSelectorContext = createContext<WalletSelectorContextValue | null>(null);

export function WalletSelectorContextProvider({ children }: { children: ReactNode }) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<ReturnType<typeof setupModal> | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const defaultWallets = await setupDefaultWallets();
      const selector = await setupWalletSelector({
        network: "testnet",
        modules: [
          setupMyNearWallet() as WalletModuleFactory,
          setupHereWallet() as WalletModuleFactory,
          setupMeteorWallet() as WalletModuleFactory,
          setupSender() as WalletModuleFactory,
          setupMathWallet() as WalletModuleFactory,
          setupNightly() as WalletModuleFactory,
          setupLedger() as WalletModuleFactory,
          setupCoin98Wallet() as WalletModuleFactory,
          setupBitteWallet() as WalletModuleFactory,
        ],
      });

      const _modal = setupModal(selector, {
        contractId: "test.testnet",
      });

      const subscription = selector.store.observable
        .pipe(
          map((state) => state.accounts),
          distinctUntilChanged()
        )
        .subscribe((accounts) => {
          setAccounts(accounts);
        });

      setSelector(selector);
      setModal(_modal);
      setLoading(false);

      return () => subscription.unsubscribe();
    };

    init().catch(console.error);
  }, []);

  if (loading) {
    return null;
  }

  const accountId = accounts.find((account) => account.active)?.accountId || null;

  return (
    <WalletSelectorContext.Provider
      value={{
        selector: selector!,
        modal: modal!,
        accounts,
        accountId
      }}
    >
      {children}
    </WalletSelectorContext.Provider>
  );
}

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);
  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    );
  }
  return context;
} 