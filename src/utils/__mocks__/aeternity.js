import { Universal } from '@aeternity/aepp-sdk/es/ae/universal';

jest.unmock('../aeternity');

import aeternity from '../aeternity';

aeternity.initClient = async () => {
  aeternity.client = await Universal({
    url: 'https://sdk-testnet.aepps.com',
    internalUrl: 'https://sdk-testnet.aepps.com',
    compilerUrl: 'https://compiler.aepps.com',
    keypair: {
      publicKey: process.env.PUBLIC_KEY,
      secretKey: process.env.SECRET_KEY,
    },
  });

  return await aeternity.initProvider();

};

export default aeternity;
