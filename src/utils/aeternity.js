import Util from './util';
import identity from '../contracts/Idenitity.aes';
import { Node, Universal, Aepp, MemoryAccount } from '@aeternity/aepp-sdk/es';

const aeternity = {
  client: null,
  address: null,
  height: null,
  networkId: null,
  passive: false,
  contractAddress: '',
};
/**
 * Timeouts wrapped promises after 30 seconds
 * Used to wait for wallets and timeout after not finiding them
 * @param promise
 * @returns {Promise<unknown>}
 */
const timeout = async (promise) => {
  return Promise.race([
    promise,
    new Promise(resolve =>
      setTimeout(() => {
        resolve('TIMEOUT');
      }, 30000)),
  ]);
};

/**
 * After finding a wallet this function is called to cache
 * basic values from the wallet.
 * @returns {Promise<boolean>}
 */
aeternity.initProvider = async () => {
  try {
    aeternity.address = await aeternity.client.address();
    aeternity.balance = await aeternity.client.balance(aeternity.address)
      .then(balance => `${Util.atomsToAe(balance)}`.replace(',', ''))
      .catch(() => '0');
    aeternity.height = await aeternity.client.height();
    aeternity.networkId = (await aeternity.client.getNodeInfo()).nodeNetworkId;
    if(aeternity.contractAddress)
      aeternity.contract = await aeternity.client.getContractInstance(identity, {contractAddress: aeternity.contractAddress});
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
/**
 * Wait for the base-aepp to to load.
 * @returns {Promise<boolean|unknown>}
 */
aeternity.initMobileBaseAepp = async () => {
  try {
    if (window.parent === window) return false;
    return await timeout(Aepp());
  } catch (e) {
    console.warn('Base Aepp init failed');
    return false;
  }
};

/**
 * Initialize a static client, mainnet or testnet
 * This client can not sign transactions that require funds (everything except static contract calls)
 * @returns {Promise<*>}
 */
aeternity.initStaticClient = async () => {
  // TESTNET
  return Universal({
    nodes: [
      {
        name: 'testnet',
        instance: await Node({
          url: 'https://sdk-testnet.aepps.com',
          internalUrl: 'https://sdk-testnet.aepps.com',
        }),
        compilerUrl: 'https://sdk-testnet.aepps.com',
        networkId: 'ae_uat',
      }],
  });
  // MAINNET
  /*
  return Universal({
    nodes: [
      {
        name: 'mainnet',
        instance: await Node({
          url: 'https://sdk-mainnet.aepps.com',
          internalUrl: 'https://sdk-mainnet.aepps.com',
        }),
        compilerUrl: 'https://sdk-mainnet.aepps.com',
        networkId: 'ae_mainnet'
      }],
  });
  */

};

/**
 * Returns true if a client has been initialized.
 * Used to check after switching pages if the initialization was already done.
 * @returns {boolean}
 */
aeternity.hasActiveWallet = () => {
  return !!aeternity.client;
};

/**
 * Checks if the initialized client is connected to the ae-mainnet
 * @returns {boolean}
 */
aeternity.isMainnet = () => {
  return aeternity.networkId === 'ae_mainnet';
};

/**
 * Initializes the aeternity sdk to be imported in other occasions
 * @returns {Promise<boolean>}
 */
aeternity.initClient = async () => {
  let result = true;

  if (process && process.env && process.env.PRIVATE_KEY && process.env.PUBLIC_KEY) {
    aeternity.client = await Universal({
      nodes: [{ name: 'testnet', instance: await Node({ url: 'https://sdk-testnet.aepps.com', internalUrl: 'https://sdk-testnet.aepps.com' }) }],
      compilerUrl: 'https://sdk-testnet.aepps.com',
      accounts: [
        MemoryAccount({ keypair: { secretKey: process.env.PRIVATE_KEY, publicKey: process.env.PUBLIC_KEY } }),
      ],
      address: process.env.PUBLIC_KEY,
      networkId: 'ae_uat',
    });
    return await aeternity.initProvider();
  }

  if (!aeternity.client) {
    try {
      aeternity.client = await aeternity.initMobileBaseAepp();
      result = await aeternity.initProvider();
    } catch (e) {
      console.error(e);
      result = false;
    }
  } else {
    result = await aeternity.initProvider();
  }
  return result;
};

/**
 * Checks if the client is still providing the same address compared to its initialization
 * In the base-aepp a user can switch his account without reloading the page therefore
 * this function should be called occasionally to verify the aepp is in sync with the wallet.
 * @returns {Promise<boolean>}
 */
aeternity.verifyAddress = async () => {
  const currAddress = await aeternity.client.address();
  return currAddress !== aeternity.address;
};

export default aeternity;
