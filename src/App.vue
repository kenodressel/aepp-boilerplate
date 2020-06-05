<template>
  <div id="app" class="min-h-screen">
    <div class="content min-h-screen max-w-desktop">
      <div class="min-h-screen wrapper" ref="wrapper" v-if="foundWallet">
        <router-view></router-view>
      </div>
      <div v-else>
        Searching for wallet...
      </div>
    </div>
  </div>
</template>

<script>
  import aeternity from './utils/aeternity.js'

  export default {
    name: 'app',
    data() {
      return {
        foundWallet: false
      }
    },
    async created() {
     aeternity.initClient().then(() => {
        this.foundWallet = true;
     });

      aeternity.initWalletSearch(() => {
        this.foundWallet = true;
      });
    }
  }
</script>

<style scoped>
  .min-h-screen {
    min-height: 100vh;
    max-height: 100vh;
    padding-bottom: 0;
    overflow-y: auto;
    background-color: #f8f8f8;
  }

  @media (min-width: 700px) {
    #app {
      position: relative;
      display: flex;
      justify-content: center;
    }

    .content {
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.15);
    }
  }
</style>
