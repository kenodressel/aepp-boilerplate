import './main.css';

import '@aeternity/aepp-components/dist/aepp.fonts.css';
// Enable if using aeternity icons
// import '@aeternity/aepp-components/dist/ae-icon/ae-icon.css'

import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
