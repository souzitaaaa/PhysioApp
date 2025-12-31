import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Email from '../views/Email.vue'
import Athletes from '../views/Athletes.vue'
import Users from '../views/Users.vue'
import Login from '../views/Login.vue'
import Tests from '../views/Tests.vue'
import Notfound from '../views/404.vue'
import axios from 'axios'
import api from '../../utils/apiUtils'

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
      path: '/:pathMatch(.*)*', // Catch-all 404 route
      name: '404',
      component: Notfound,
      meta: { title: '404 Not Found', showSidebar: false },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const isLoginPage = to.name === 'Login';
  const requiresAuth = to.meta.requiresAuth;

  console.log('[Router] Navigating to:', to.path, '| Requires auth:', requiresAuth);

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

  // If route requires auth, verify authentication
  if (requiresAuth) {
    try {
      const response = await api.get('/auth/me');
      console.log('[Router] Authentication verified');
      // Store user data in Pinia/Vuex if needed
      // useAuthStore().setUser(response.data);
      return next();
    } catch (error) {
      console.error('[Router] Auth check failed:', error.response?.data);

      // The axios interceptor will handle token refresh automatically
      // If we get here, it means refresh also failed
      if (error.response?.status === 401) {
        console.log('[Router] Unauthorized, redirecting to login');
        return next('/login');
      }

      // Other errors - still redirect to login for safety
      console.error('[Router] Unexpected error, redirecting to login');
      return next('/login');
    }
  }

  // No auth required, proceed
  next();
});


export default router
