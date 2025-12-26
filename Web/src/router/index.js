import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Email from '../views/Email.vue'
import Athletes from '../views/Athletes.vue'
import Users from '../views/Users.vue'
import Login from '../views/Login.vue'
import Tests from '../views/Tests.vue'
import { supabase } from '../../utils/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { title: 'Login' },
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'Home', requiresAuth: true },
    },
    {
      path: '/email',
      name: 'Email',
      component: Email,
      meta: { title: 'Email', requiresAuth: true },
    },
    {
      path: '/atletas',
      name: 'Athletes',
      component: Athletes,
      meta: { title: 'Athletes', requiresAuth: true },
    },
    {
      path: '/utilizadores',
      name: 'Users',
      component: Users,
      meta: { title: 'Users', requiresAuth: true },
    },
    {
      path: '/tests',
      name: 'Tests',
      component: Tests,
      meta: { title: 'Tests' },
    },
  ],
})

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession()

  if (to.name === 'Login' && data.session)
    return '/'

  if (to.meta.requiresAuth && !data.session)
    return '/login'

})


export default router
