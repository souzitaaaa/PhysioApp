import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Email from '../views/Email.vue'
import Athletes from '../views/Athletes.vue'
import Users from '../views/Users.vue'
import Tests from '../views/Tests.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'Home' },
    },
    {
      path: '/email',
      name: 'Email',
      component: Email,
      meta: { title: 'Email' },
    },
    {
      path: '/atletas',
      name: 'Athletes',
      component: Athletes,
      meta: { title: 'Athletes' },
    },
    {
      path: '/utilizadores',
      name: 'Users',
      component: Users,
      meta: { title: 'Users' },
    },
    {
      path: '/tests',
      name: 'Tests',
      component: Tests,
      meta: { title: 'Tests' },
    },
  ],
})

export default router
