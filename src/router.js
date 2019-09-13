import Router from 'vue-router'
import Home from './views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {title: 'Home'}
  }
]

const router = new Router({mode: 'hash', routes: routes})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Example Aepp`
  next()
})

export default router;
