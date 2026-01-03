<template>
  <div :class="[
    'flex flex-col p-4 rounded-xl transition-all duration-300',
    isCollapsed ? 'w-16' : 'w-48'
  ]" style="background-color: var(--color-primary);">
    <!-- Logo -->
    <div class="flex items-center justify-center shrink-0 mb-2">
      <img :src="isCollapsed ? '/images/logo-small.svg' : '/images/logo-big.svg'" alt="Logo"
        :class="isCollapsed ? 'max-w-12' : 'max-w-28'" />
    </div>

    <!-- Menu Items -->
    <div class="overflow-y-auto flex-1">
      <ul v-for="(menu, index) in menus" :key="index" class="list-none pt-4 m-0">
        <li>
          <!-- Title -->
          <div class="mb-2 flex items-center justify-between text-gray-400">
            <span class="font-semibold text-xs truncate whitespace-nowrap overflow-hidden text-center"
              :title="menu.label">
              {{ menu.label }}
            </span>
          </div>

          <ul class="list-none p-0 m-0 overflow-hidden">
            <li v-for="(item, itemIndex) in menu.items" :key="itemIndex">
              <RouterLink :to="item.route" :class="[
                'group mb-2 py-2 px-2 rounded-lg transition-all duration-200',
                isCollapsed
                  ? 'flex justify-center items-center'
                  : 'flex items-center gap-3',
                $route.path === item.route
                  ? 'bg-white text-[--color-primary]'
                  : 'text-white hover:bg-white hover:text-[--color-primary]'
              ]">
                <!-- Icon -->
                <i :class="[item.icon, 'text-lg transition-colors duration-200']"></i>

                <!-- Label -->
                <h1 v-if="!isCollapsed" class="text-base font-semibold transition-colors duration-200">
                  {{ item.label }}
                </h1>

                <!-- Badge -->
                <span v-if="item.badge && !isCollapsed" class="ml-auto inline-flex items-center justify-center
           bg-white rounded-lg font-bold transition-colors duration-200"
                  style="min-width:1.5rem;height:1.5rem;color: var(--color-primary);">
                  {{ item.badge }}
                </span>
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Bottom Section -->
    <div class="mt-auto">
      <hr class="mb-4 border-t border-0 border-gray-500" />
      <div class="flex items-center shrink-0" :class="isCollapsed ? 'justify-center' : 'justify-between'">
        <!-- Avatar + Username (hidden when collapsed) -->
        <template v-if="!isCollapsed" class="flex items-center">
          <Avatar :image="currentUser?.profile?.pfp || '/images/unknown_user.jpg'" alt="UserPfp" shape="circle"
            class="avatar-circle">
          </Avatar>
          <p :class="isCollapsed ? 'ml-0' : 'ml-2'" class="text-base font-base text-white truncate max-w-[85px]">
            {{ currentUser?.profile?.name || 'User' }}
          </p>
        </template>

        <!-- Logout Icon -->
        <span :class="isCollapsed ? 'ml-0' : 'ml-auto'">
          <span role="button" aria-label="Logout"
            class="text-white cursor-pointer transition duration-200 hover:opacity-60" @click="handleLogout">
            <i class="fa-solid fa-right-from-bracket text-lg"></i>
          </span>

        </span>
      </div>
    </div>

  </div>

</template>

<script>
import { safeGet } from '../../utils/utils.js'
import axios from 'axios';
import api from '../../utils/apiUtils.js';
import { supabase } from '../../utils/supabase.js';

export default {
  data() {
    return {
      sidebarOpen: true,
      windowWidth: window.innerWidth,
      collapseWidth: 768,
      emailErrorCount: [],
      menus: [
        {
          label: 'GERAL',
          items: [
            { label: 'Dashboard', icon: 'fa-solid fa-house', route: '/' },
            { label: 'Emails', icon: 'fa-solid fa-envelope', route: '/email', badge: '' },
            { label: 'Atletas', icon: 'fa-solid fa-dumbbell', route: '/atletas' },
          ]
        },
        {
          label: 'ADMINISTRAÇÃO',
          items: [
            { label: 'Utilizadores', icon: 'fa-solid fa-users', route: '/utilizadores' },
          ]
        }
      ],
      currentUser: null,
    }
  },
  computed: {
    isCollapsed() {
      return this.windowWidth < this.collapseWidth;
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.loadEmailErrorCount()
    this.loadCurrentUser()
    this.subcribeEmails()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    subcribeEmails() {
      this.channel = supabase
        .channel('emails-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            shcema: 'public',
            table: 't_email'
          },
          (payload) => {
            console.log('alteraçao:', payload)
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 't_injury_record'
          },
          (payload) => {
            this.loadEmailErrorCount()
          }
        )
        .subscribe()
    },
    async loadEmailErrorCount() {
      const response = await safeGet(
        axios.get('http://localhost:3000/emails/error_count'),
        { count: 0 }
      );

      console.log("getEmailErrorCount: ", response.count)
      this.emailErrorCount = response.count;

      // this.menus.forEach(menu => {
      //   menu.items.forEach(item => {
      //     if (item.label === 'Emails') {
      //       item.badge = this.emailErrorCount > 0 ? this.emailErrorCount : '';
      //     }
      //   });
      // });
    },
    async loadCurrentUser() {
      try {
        const res = await api.get('/auth/me')
        console.log("loadCurrentUser: ", res.data);
        this.currentUser = res.data
      } catch (err) {
        console.error('Erro ao carregar user', err)
        this.currentUser = null
      }
    },
    async handleLogout() {
      try {
        await api.post('/auth/logout')
        this.currentUser = null
        this.$router.push('/login')
      } catch (err) {
        console.error('Erro ao fazer logout', err)
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
  },
}

</script>
