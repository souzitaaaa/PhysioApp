<template>
  <div class="w-full h-full">
    <!-- Loading State -->
    <div v-if="isLoading" class="w-full h-full flex items-center justify-center bg-gray-300">
      <div class="flex flex-col items-center gap-4">
        <ProgressSpinner style="width: 50px; height: 50px; stroke: var(--color-primary)" strokeWidth="8"
          fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        <p class="text-gray-600 font-medium">A carregar...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else :class="['w-full h-full flex bg-gray-300', showSidebar ? 'p-2 gap-2' : '']">
      <Sidebar v-if="showSidebar" />
      <div class="flex-1 h-full overflow-y-auto">
        <div v-if="showSidebar" class="w-auto h-full rounded-2xl p-4 bg-white">
          <RouterView />
        </div>
        <div v-else class="flex h-full items-center justify-center">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../utils/supabase';
import axios from 'axios';
import { RouterView } from 'vue-router'
import Sidebar from './views/Sidebar.vue'

export default {
  components: {
    Sidebar,
    RouterView,
  },
  data() {
    return {
      sidebarOpen: true,
      isLoading: true,
    }
  },
  watch: {},
  computed: {
    showSidebar() {
      return this.$route.meta.showSidebar
    },
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false
      this.loadEmails();
    }, 300)
  },
  methods: {
    async loadEmails() {
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.error("User not authenticated");
        this.$router.push('/login');
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:3000/gmail/emails",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (err) {
        console.error("Failed to start Gmail Emails", err);
      }
    },
  },
}
</script>

<!-- DEFAULT INIT STRUCTURE
<template></template>
<script>
export default {
  components: {},
  data() {
    return {}
  },
  watch: {},
  mounted() {},
  methods: {},
}
</script> 
-->
