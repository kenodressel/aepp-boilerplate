import identity from '../contracts/Idenitity.aes';
import {Node, Universal, Aepp, MemoryAccount} from '@aeternity/aepp-sdk/es';
import {EventBus} from './eventBus';

const TESTNET_URL = 'https://testnet.aeternity.io';
const MAINNET_URL = 'https://mainnet.aeternity.io';
const COMPILER_URL = 'https://compiler.aepps.com';

const aeternity = {
  client: null,
  networkId: null,
  static: false,
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
    const networkId = (await aeternity.client.getNodeInfo()).nodeNetworkId;
    const changedNetwork = aeternity.networkId !== networkId;
    aeternity.networkId = networkId
    if (aeternity.contractAddress)
      aeternity.contract = await aeternity.client.getContractInstance(identity, {contractAddress: aeternity.contractAddress});
    if (changedNetwork) EventBus.$emit('networkChange');
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
  aeternity.static = true;

  // TESTNET
  return Universal({
    compilerUrl: COMPILER_URL,
    nodes: [
      {
        name: 'testnet',
        instance: await Node({
          url: TESTNET_URL,
        }),
      }],
  });
  // MAINNET
  /*
  return Universal({
    compilerUrl: COMPILER_URL,
    nodes: [
      {
        name: 'mainnet',
        instance: await Node({
          url: MAINNET_URL,
        }),
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
      nodes: [{name: 'testnet', instance: await Node({url: TESTNET_URL})}],
      compilerUrl: COMPILER_URL,
      accounts: [
        MemoryAccount({keypair: {secretKey: process.env.PRIVATE_KEY, publicKey: process.env.PUBLIC_KEY}}),
      ],
    });
    return await aeternity.initProvider();
  }

  if (!aeternity.client) {
    try {
      aeternity.client = await aeternity.initMobileBaseAepp();
      if (!aeternity.client) aeternity.client = await aeternity.initStaticClient();
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
