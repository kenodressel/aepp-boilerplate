import Router from 'vue-router';
import Vue from 'vue';

import Home from '../views/Home.vue';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Home' },
  },
];

const router = new Router({ mode: 'hash', routes });

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Example Aepp`;
  next();
});

export default router;
