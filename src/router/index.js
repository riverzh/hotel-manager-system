import Vue from 'vue'
import Router from 'vue-router'
import {
  Main
} from 'element-ui';



Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      name: 'login',
      path: '/login',
      component: resolve => require(['@/components/page/userLogin.vue'], resolve)
    },
    {
      path: '/home',
      component: resolve => require(['@/components/common/baseHome.vue'], resolve),
      children: [{
          path: '',
          redirect: 'main'
        },
        {
          path: 'main',
          name: 'main',
          component: resolve => require(['../components/page/baseMain.vue'], resolve)
        },
        {
          name: 'order',
          path: 'order',
          component: resolve => require(['../components/page/orderList.vue'], resolve)
        },
        {
          name: 'orderCreate',
          path: 'orderCreate',
          component: resolve => require(['../components/page/orderCreate.vue'], resolve)
        },
        {
          name: 'orderEdit',
          path: 'orderCreate:id',
          component: resolve => require(['../components/page/orderCreate.vue'], resolve)
        },
        {
          name: 'searchDetail',
          path: 'search',
          component: resolve => require(['../components/page/searchDetail.vue'], resolve)
        },
        {
          name: 'roomMaintenance',
          path: 'maintenance',
          component: resolve => require(['../components/page/roomMaintenance.vue'], resolve)
        },
        {
          name: 'userManage',
          path: 'personal',
          component: resolve => require(['../components/page/userManage.vue'], resolve)
        }
      ]
    }
  ]
})
