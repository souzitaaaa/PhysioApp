<template>
  <div class="w-full h-full">
    <Toast />
    <!-- Error Message for Mobile Devices -->
    <div v-if="isMobile" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div
        class="flex flex-col items-center justify-center max-w-lg w-4/5 bg-red-100 border border-red-300 rounded-xl p-6 shadow-xl">
        <i class="bi bi-exclamation-triangle-fill text-4xl text-red-600 mb-4"></i>
        <h4 class="text-xl font-semibold text-center text-red-800 mb-4">Oops!</h4>
        <p class="text-center text-red-700">Esta aplicação não é compatível com dispositivos móveis. Por favor, aceda
          através de um computador.</p>
      </div>
    </div>

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
import api from '../utils/apiUtils';

export default {
  components: {
    Sidebar,
    RouterView,
  },
  data() {
    return {
      sidebarOpen: true,
      isLoading: true,
      isMobile: false,
      emailPollingInterval: null,
      isCheckingEmails: false,
      gmailConnected: false,
      POLLING_INTERVAL: 5 * 60 * 1000, // 5 minutes
    };
  },
  watch: {
    // Watch for route changes to start/stop polling
    '$route'(to, from) {
      if (to.meta.showSidebar && !from.meta.showSidebar) {
        // Navigated from public to authenticated route
        this.checkGmailConnection().then(() => {
          if (this.gmailConnected) {
            this.startEmailPolling();
          }
        });
      } else if (!to.meta.showSidebar && from.meta.showSidebar) {
        // Navigated from authenticated to public route
        this.stopEmailPolling();
      }
    }
  },
  computed: {
    showSidebar() {
      return this.$route.meta.showSidebar;
    },
    isAuthenticatedRoute() {
      return this.$route.meta.showSidebar !== false;
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);

    setTimeout(async () => {
      this.isLoading = false;
      if (this.isAuthenticatedRoute) {
        await this.checkGmailConnection();
        if (this.gmailConnected) {
          this.startEmailPolling();
        }
      }
    }, 300);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
    this.stopEmailPolling();
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 1279;
    },

    async checkGmailConnection() {
      try {
        const response = await api.get('/gmail/check-token');
        this.gmailConnected = response.data.connected && !response.data.expired;
        console.log('📧 [App] Gmail connection status:', this.gmailConnected);

        if (!this.gmailConnected) {
          this.$toast.add({
            severity: 'error',
            summary: 'Gmail Desconectado',
            detail: 'Por favor, conecte sua conta Gmail para receber emails automaticamente.',
            life: 5000
          });
        }
      } catch (error) {
        console.error('❌ [App] Error checking Gmail connection:', error);
        this.gmailConnected = false;
        this.$toast.add({
          severity: 'error',
          summary: 'Erro de Conexão',
          detail: 'Não foi possível verificar a conexão com o Gmail.',
          life: 5000
        });
      }
    },

    startEmailPolling() {
      if (this.emailPollingInterval) {
        console.warn('⚠️ [App] Email polling already started');
        return;
      }

      console.log('🔄 [App] Starting email polling...');

      this.checkForNewEmails();

      this.emailPollingInterval = setInterval(() => {
        this.checkForNewEmails();
      }, this.POLLING_INTERVAL);
    },

    stopEmailPolling() {
      if (this.emailPollingInterval) {
        console.log('🛑 [App] Stopping email polling');
        clearInterval(this.emailPollingInterval);
        this.emailPollingInterval = null;
      }
    },

    async checkForNewEmails() {
      if (this.isCheckingEmails) {
        console.log('⏳ [App] Email check already in progress, skipping...');
        return;
      }

      if (!this.gmailConnected) {
        console.log('🔒 [App] Gmail not connected, skipping email check');
        return;
      }

      this.isCheckingEmails = true;

      try {
        console.log('📬 [App] Checking for new emails...');
        const response = await api.get('/gmail/emails');

        console.log('✅ [App] Email check completed');

      } catch (err) {
        if (err.response?.status === 401) {
          console.log('🔒 [App] Authentication expired, stopping polling');
          this.gmailConnected = false;
          this.stopEmailPolling();
        } else {
          console.error('❌ [App] Error checking emails:', err);
        }
      } finally {
        this.isCheckingEmails = false;
      }
    },
    async forceEmailCheck() {
      await this.checkGmailConnection();
      if (this.gmailConnected) {
        await this.checkForNewEmails();
      }
    },
    restartEmailPolling() {
      this.stopEmailPolling();
      this.checkGmailConnection().then(() => {
        if (this.gmailConnected) {
          this.startEmailPolling();
        }
      });
    }
  },
};
</script>