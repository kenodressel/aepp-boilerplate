<template>
  <div>
    <h1>Account</h1>
    {{address}}
    <h1>Balance</h1>
    {{balance}} AE
  </div>
</template>

<script>
  import aeternity from "../utils/aeternity";
  import axios from "axios";

  export default {
    name: 'Home',
    components: {},
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
