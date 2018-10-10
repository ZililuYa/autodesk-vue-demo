import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import createBucket from '@/components/bucket/createBucket'
import listBucket from '@/components/bucket/listBucket'
import detailBucket from '@/components/bucket/detailBucket'
import model from '@/components/model'
import modelPlan from '@/components/modelPlan'
import key from '@/components/key'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/modelPlan',
      name: 'modelPlan',
      component: modelPlan
    },
    {
      path: '/model',
      name: 'model',
      component: model
    },
    {
      path: '/createBucket',
      name: 'createBucket',
      component: createBucket
    },
    {
      path: '/listBucket',
      name: 'listBucket',
      component: listBucket
    },
    {
      path: '/detailBucket',
      name: 'detailBucket',
      component: detailBucket
    },
    {
      path: '/key',
      name: 'key',
      component: key
    }
  ]
})
