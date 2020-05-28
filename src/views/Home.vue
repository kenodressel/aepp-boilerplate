<template>
  <div>
    <span v-if="networkId">Connected: {{networkId}}</span>
    <div v-if="address" class="address">Account: {{address}}</div>
    <div v-else>No Account set</div>
    <div v-if="balance" class="balance">Balance: {{balance}} AE</div>
    <br>
    <h2>Components Test</h2>
    <span class="hidden">If you see this, tailwindcss is not working</span>
    <div class="mt-2 ml-2">
      <ae-button face="round" fill="primary"> Primary Button</ae-button>
    </div>
  </div>
</template>

<script>
  import aeternity from '../utils/aeternity'
  import axios from 'axios'
  import {AeButton} from '@aeternity/aepp-components/src/components'
  import Util from "../utils/util";
  import { EventBus } from '../utils/eventBus';

  export default {
    name: 'Home',
    components: {AeButton},
    data() {
      return {
        networkId: null,
        address: null,
        balance: null
      };
    },
    methods: {
      async loadData() {
        this.networkId = aeternity.networkId;

        // Display the values if not static client
        if (!aeternity.static) {
          this.address = await aeternity.client.address()
          this.balance = await aeternity.client.balance(this.address)
            .then(balance => `${Util.atomsToAe(balance)}`.replace(',', ''))
            .catch(() => '0');

          // Use the faucet to stock up the account with some balance. This is especially helpful for users
          // who are new to the eco system and are testing your aepp.
          if (!aeternity.isMainnet() && this.balance <= 5) {
            await axios.post(
              `https://testnet.faucet.aepps.com/account/${this.address}`,
              {},
              {headers: {'content-type': 'application/x-www-form-urlencoded'}})
              .catch(console.error);
          }
        }
      }
    },
    async mounted() {
      // init the client once the component is loaded. This should be done in every view.
      await aeternity.initClient();
      EventBus.$on('networkChange', this.loadData);
      EventBus.$on('addressChange', this.loadData);
      this.loadData();
    },
  };
</script>

<style scoped>

</style>
