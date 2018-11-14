import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: 'home' */ '@/pages/Home')
    },
    {
      path: '/',
      name: 'Todo',
      component: () => import(/* webpackChunkName: 'home' */ '@/pages/Todo')
    }
  ]
})
