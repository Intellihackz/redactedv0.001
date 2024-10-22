import { connect, keyStores, WalletConnection, ConnectedWalletAccount } from 'near-api-js';

const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'test.testnet';

const connectionConfig = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://testnet.mynearwallet.com/",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
};

export class Wallet {
  private walletConnection: WalletConnection | null = null;

  async startUp(): Promise<boolean> {
    const nearConnection = await connect(connectionConfig);
    this.walletConnection = new WalletConnection(nearConnection, CONTRACT_NAME);
    return this.isSignedIn();
  }

  signIn() {
    this.walletConnection?.requestSignIn({
        contractId: "test.testnet",
        methodNames: [], // Add methods you want to call as an array here
        successUrl: `${window.location.origin}`, // optional redirect URL on success
        failureUrl: `${window.location.origin}`,
        keyType: 'ed25519'
    });
  }

  signOut() {
    if (this.walletConnection) {
      this.walletConnection.signOut();
      // Instead of reloading the page, we'll return a promise that resolves when sign out is complete
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

export const wallet = new Wallet();
