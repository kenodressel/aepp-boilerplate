import Aepp from '@aeternity/aepp-sdk/es/ae/aepp';
import { Universal } from '@aeternity/aepp-sdk/es/ae/universal';
import Util from './util';
import identity from '../contracts/Idenitity.aes';

const aeternity = {
  client: null,
  address: null,
  height: null,
  networkId: null,
  passive: false,
  contractAddress: '',
};

const timeout = async promise => Promise.race([
  promise,
  new Promise(resolve => setTimeout(() => {
    resolve('TIMEOUT');
  }, 30000)),
]);

aeternity.initProvider = async () => {
  try {
    aeternity.address = await aeternity.client.address();
    aeternity.balance = await aeternity.client.balance(aeternity.address)
      .then(balance => `${Util.atomsToAe(balance)}`.replace(',', ''))
      .catch(() => '0');
    aeternity.height = await aeternity.client.height();
    aeternity.networkId = (await aeternity.client.getNodeInfo()).nodeNetworkId;
    if (aeternity.contractAddress) {
      aeternity.contract = await aeternity.client.getContractInstance(identity,
        { contractAddress: aeternity.contractAddress });
    }
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return false;
  }
};

aeternity.initMobileBaseAepp = async () => {
  try {
    if (window.parent === window) return false;
    return await timeout(Aepp());
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Base Aepp init failed');
    return false;
  }
};

aeternity.initStaticClient = async () => Universal({
  url: 'https://sdk-testnet.aepps.com',
  internalUrl: 'https://sdk-testnet.aepps.com',
  compilerUrl: 'https://compiler.aepps.com',
});

// MAINNET
/*
  return Universal({
  url: 'https://sdk-mainnet.aepps.com',
  internalUrl: 'https://sdk-mainnet.aepps.com',
  compilerUrl: 'https://compiler.aepps.com',
});
 */

aeternity.hasActiveWallet = () => !!aeternity.client;

aeternity.isTestnet = () => aeternity.networkId !== 'ae_mainnet';

/**
 * Initializes the aeternity sdk to be imported in other occasions
 * @returns {Promise<boolean>}
 */
aeternity.initClient = async () => {
  let result = true;

  if (process && process.env && process.env.PRIVATE_KEY && process.env.PUBLIC_KEY) {
    aeternity.client = await Universal({
      url: 'https://sdk-testnet.aepps.com',
      internalUrl: 'https://sdk-testnet.aepps.com',
      compilerUrl: 'https://compiler.aepps.com',
      keypair: {
        publicKey: process.env.PUBLIC_KEY,
        secretKey: process.env.PRIVATE_KEY,
      },
    });
    return aeternity.initProvider();
  }

  if (!aeternity.client) {
    try {
      aeternity.client = await aeternity.initMobileBaseAepp();
      result = await aeternity.initProvider();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      result = false;
    }
  } else {
    result = await aeternity.initProvider();
  }
  return result;
};

aeternity.verifyAddress = async () => {
  const currAddress = await aeternity.client.address();
  return currAddress !== aeternity.address;
};

export default aeternity;
