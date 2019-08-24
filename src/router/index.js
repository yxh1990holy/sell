import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'
import parent from '@/test/parent'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/goods'	//默认页面重定向
    },
    {
      path: '/goods',
      component: goods
    },
    {
    	path: '/ratings',
    	component: ratings
    },
    {
    	path: '/seller',
    	component: seller
    },
    {
      path: '/parent',
      component: parent
    }
  ]
})
