import { RpcAepp, Node } from '@aeternity/aepp-sdk/es';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import aeternity from './aeternity';

// Send wallet connection info to Aepp through content script
const NODE_URL = 'https://sdk-mainnet.aepps.com';
const NODE_INTERNAL_URL = 'https://sdk-mainnet.aepps.com';

export const wallet = {
  client: null,
  height: null,
  pub: null,
  balance: null,
  walletName: null,

  async disconnect () {
    await this.client.disconnectWallet();
    this.walletName = null;
    this.pub = null;
    this.balance = null;
    await this.scanForWallets();
  },

  async scanForWallets (successCallback) {
    const scannerConnection = await BrowserWindowMessageConnection({
      connectionInfo: { id: 'spy' },
    });
    const detector = await Detector({ connection: scannerConnection });
    const handleWallets = async function ({ wallets, newWallet }) {
      detector.stopScan();
      console.log("stopScan done");

      await this.client.connectToWallet(await newWallet.getConnection());
      console.log("connectToWallet done");
      await this.client.subscribeAddress('subscribe', 'current');
      console.log("subscribeAddress done");

      aeternity.client = this.client;
      await aeternity.initProvider();
      console.log("initProvider done");

      successCallback();
    };

    detector.scan(handleWallets.bind(this));
  },
  async init (successCallback) {
    // Open iframe with Wallet if run in top window
    window !== window.parent;
    //
    this.client = await RpcAepp({
      name: 'AEPP',
      nodes: [{ name: 'test-net', instance: await Node({ url: NODE_URL, internalUrl: NODE_INTERNAL_URL }) }],
        compilerUrl: 'https://latest.compiler.aepps.com'
    });
    this.height = await this.client.height();
    await this.scanForWallets(successCallback);
  },
};
