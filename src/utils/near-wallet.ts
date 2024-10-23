/**
 * Provides a wrapper around the NEAR wallet connection and functionality.
 * This class handles the initialization of the NEAR API, establishing the wallet connection,
 * and provides methods for signing in, signing out, and interacting with the contract.
 */
/* eslint-disable */
import { ConnectedWalletAccount } from 'near-api-js';

const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'nft.examples.testnet';

let nearApi: any = null;

const initNearApi = async () => {
  if (typeof window !== 'undefined' && !nearApi) {
    nearApi = await import('near-api-js');
  }
};

const getConnectionConfig = () => ({
  networkId: "testnet",
  keyStore: typeof window !== 'undefined' && nearApi ? new nearApi.keyStores.BrowserLocalStorageKeyStore() : undefined,
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://testnet.mynearwallet.com/",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
});

export class Wallet {
  private walletConnection: any = null;

  async startUp(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false;
    }
    await initNearApi();
    if (!nearApi) {
      console.error('Failed to initialize nearApi');
      return false;
    }
    const nearConnection = await nearApi.connect(getConnectionConfig());
    this.walletConnection = new nearApi.WalletConnection(nearConnection, CONTRACT_NAME);
    return this.isSignedIn();
  }

  signIn() {
    if (typeof window === 'undefined' || !this.walletConnection) {
      return;
    }
    this.walletConnection.requestSignIn({
        contractId: "nft.examples.testnet",
        methodNames: [],
        successUrl: `${window.location.origin}`,
        failureUrl: `${window.location.origin}`,
        keyType: 'ed25519'
    });
  }

  signOut() {
    if (this.walletConnection) {
      this.walletConnection.signOut();
      return Promise.resolve();
    }
    return Promise.reject("Wallet connection not established");
  }

  isSignedIn(): boolean {
    return this.walletConnection?.isSignedIn() || false;
  }

  getAccountId(): string {
    return this.walletConnection?.getAccountId() || '';
  }

  getAccount(): ConnectedWalletAccount | null {
    return this.walletConnection?.account() || null;
  }

  async getAccountBalance(): Promise<string> {
    if (!this.walletConnection) {
      return '0';
    }
    const account = await this.walletConnection.account();
    const balance = await account.getAccountBalance();
    return balance.available;
  }

  async callMethod({ method, args, deposit }: { method: string; args: Record<string, unknown>; deposit: string }) {
    if (!this.walletConnection) {
      throw new Error("Wallet connection not established");
    }
    const account = this.walletConnection.account();
    return account.functionCall({
      contractId: CONTRACT_NAME,
      methodName: method,
      args: args,
      attachedDeposit: BigInt(deposit),
    });
  }
}

export const wallet = typeof window !== 'undefined' ? new Wallet() : null;
