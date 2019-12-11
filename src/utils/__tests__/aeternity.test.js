jest.mock('../aeternity');

import aeternity from '../aeternity';

describe('aeternity.js', () => {

  test('should init a mock client', async () => {
    const result = await aeternity.initClient();
    expect(result).toBeTruthy();
  });

  test('should have the account key set in env', async () => {
    expect(aeternity.address).toBe(process.env.PUBLIC_KEY);
  });

  test('should have a balance', async () => {
    expect(aeternity.balance).not.toBeNull();
  });

  test('should be testnet', async () => {
    expect(aeternity.isTestnet()).toBeTruthy();
  });

});
