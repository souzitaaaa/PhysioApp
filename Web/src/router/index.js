import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Email from '../views/Email.vue'
import Athletes from '../views/Athletes.vue'
import Users from '../views/Users.vue'
import Login from '../views/Login.vue'
import Tests from '../views/Tests.vue'
import Notfound from '../views/404.vue'
import axios from 'axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { title: 'Login', showSidebar: false },
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'Home', requiresAuth: true, showSidebar: true },
    },
    {
      path: '/email',
      name: 'Email',
      component: Email,
      meta: { title: 'Email', requiresAuth: true, showSidebar: true },
    },
    {
      path: '/atletas',
      name: 'Athletes',
      component: Athletes,
      meta: { title: 'Athletes', requiresAuth: true, showSidebar: true },
    },
    {
      path: '/utilizadores',
      name: 'Users',
      component: Users,
      meta: { title: 'Users', requiresAuth: true, showSidebar: true },
    },
    {
      path: '/tests',
      name: 'Tests',
      component: Tests,
      meta: { title: 'Tests', requiresAuth: true, showSidebar: true },
    },
    {
      path: '/:pathMatch(.*)*', // Catch-all 404 route
      name: '404',
      component: Notfound,
      meta: { title: '404 Not Found', showSidebar: false },
    },
  ],
})


const api = axios.create({
  baseURL: 'http://localhost:3000',
})

router.beforeEach(async (to) => {
  const token = localStorage.getItem('access_token')

  if (to.name === 'Login' && token) return '/'

  if (to.meta.requiresAuth) {
    if (!token) return '/login'

    try {
      await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch {
      localStorage.removeItem('access_token')
      return '/login'
    }
  }
})


export default router
