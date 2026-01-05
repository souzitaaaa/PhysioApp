import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Email from '../views/Email.vue'
import Athletes from '../views/Athletes.vue'
import Users from '../views/Users.vue'
import Login from '../views/Login.vue'
import Tests from '../views/Tests.vue'
import Notfound from '../views/404.vue'
import api from '../../utils/apiUtils'

// Create Vue Router instance
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
      name: 'Atletas',
      component: Athletes,
      meta: { title: 'Atletas', requiresAuth: true, showSidebar: true },
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
      path: '/:pathMatch(.*)*', 
      name: '404',
      component: Notfound,
      meta: { title: '404 Not Found', showSidebar: false },
    },
  ],
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const isLoginPage = to.name === 'Login';
  const requiresAuth = to.meta.requiresAuth;

  console.log('[Router] Navigating:', from.path, '→', to.path, '| Auth required:', requiresAuth);

  if (!requiresAuth && !isLoginPage) {
    return next();
  }

  // If going to login page, check if already authenticated
  if (isLoginPage) {
    try {
      const response = await api.get('/auth/me');
      console.log('[Router] Already authenticated, redirecting to home');
      return next('/');
    } catch (error) {
      console.log('[Router] Not authenticated, allowing login page');
      return next();
    }
  }

  try {
    const response = await api.get('/auth/me');
    console.log('[Router] User authenticated:', response.data.profile?.email);

    if (isLoginPage) {
      console.log('[Router] Already logged in, redirecting to home');
      return next('/');
    }

    return next();

  } catch (error) {
    const errorCode = error.response?.data?.code;

    console.log('[Router] Auth check failed:', errorCode);

    if (isLoginPage)
      return next();

    if (requiresAuth) {
      console.log('[Router] Not authenticated, redirecting to login');
      return next('/login');
    }
    return next();
  }
});


export default router
