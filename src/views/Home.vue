<template>
  <div>
    <h1>Account</h1>
    {{address}}
    <h1>Balance</h1>
    {{balance}} AE
    <br>
    <br>
    <br>
    <h2>Components Test</h2>
    <span class="hidden">If you see this, tailwindcss is not working</span>
    <div class="mt-2 ml-2">
      <ae-button face="round" fill="primary"> Primary Button </ae-button>
    </div>
  </div>
</template>

<script>
  import aeternity from '../utils/aeternity'
  import axios from 'axios'
  import {AeButton} from '@aeternity/aepp-components/src/components'

  export default {
    name: 'Home',
    components: { AeButton },
    data() {
      return {
        address: null,
        balance: null
      };
    },


    async mounted() {
      await aeternity.initClient();

      if (aeternity.isTestnet() && aeternity.balance <= 5) {
        await axios.post(`https://testnet.faucet.aepps.com/account/${aeternity.address}`, {}, {headers: {'content-type': 'application/x-www-form-urlencoded'}}).catch(console.error);
      }
      this.address = aeternity.address;
      this.balance = aeternity.balance;
    },
  };
</script>

<style scoped>

</style>
