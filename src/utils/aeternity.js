import Aepp from '@aeternity/aepp-sdk/es/ae/aepp'
import Util from './util'
import identity from '../contracts/Idenitity.aes'
import {Universal} from "@aeternity/aepp-sdk/es/ae/universal";

const aeternity = {
  client: null,
  address: null,
  height: null,
  networkId: null,
  passive: false,
  contractAddress: ''
};

const timeout = async (promise) => {
  return Promise.race([
    promise,
    new Promise(resolve =>
      setTimeout(() => {
        resolve('TIMEOUT');
      }, 30000))
  ]);
};

aeternity.initProvider = async () => {
  try {

    aeternity.address = await aeternity.client.address();
    aeternity.balance = await aeternity.client.balance(aeternity.address)
      .then(balance => `${Util.atomsToAe(balance)}`.replace(',', ''))
      .catch(() => '0');
    aeternity.height = await aeternity.client.height();
    aeternity.networkId = (await aeternity.client.getNodeInfo()).nodeNetworkId;
    if(aeternity.contractAddress)
      aeternity.contract = await aeternity.client.getContractInstance(registryContractSource, {contractAddress: aeternity.contractAddress});
    return true;
  } catch (e) {
    console.error(e);
    return false
  }
};

aeternity.initMobileBaseAepp = async () => {
  try {
    if (window.parent === window) return false;
    return await timeout(Aepp());
  } catch (e) {
    console.warn('Base Aepp init failed');
    return false;
  }
};

aeternity.initStaticClient = async () => {
  return Universal({
    url: 'http://localhost:3001',
    internalUrl: 'http://localhost:3001',
    compilerUrl: 'http://localhost:3080'
  });
};

aeternity.hasActiveWallet = () => {
  return !!aeternity.client;
};

aeternity.isTestnet = () => {
  return aeternity.networkId !== 'ae_mainnet';
};

/**
 * Initializes the aeternity sdk to be imported in other occasions
 * @returns {Promise<boolean>}
 */
aeternity.initClient = async () => {
  let result = true;
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

aeternity.verifyAddress = async () => {
  const currAddress = await aeternity.client.address();
  return currAddress !== aeternity.address
};


export default aeternity
