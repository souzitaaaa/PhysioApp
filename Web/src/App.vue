<template>
  <div class="w-full h-full">
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
import { RouterView } from 'vue-router';
import Sidebar from './views/Sidebar.vue';

export default {
  components: {
    Sidebar,
    RouterView,
  },
  data() {
    return {
      sidebarOpen: true,
      isLoading: true,
      isMobile: false, // Controla a visibilidade do erro para mobile
    };
  },
  watch: {},
  computed: {
    showSidebar() {
      return this.$route.meta.showSidebar;
    },
  },
  mounted() {
  // Inicializa a verificação da largura da tela
  this.checkMobile();

  // Adiciona um event listener para atualizar o estado do dispositivo móvel ao redimensionar a janela
  window.addEventListener('resize', this.checkMobile);

  setTimeout(() => {
    this.isLoading = false;
    this.loadEmails();
  }, 300);
},
beforeDestroy() {
  // Remova o event listener quando o componente for destruído
  window.removeEventListener('resize', this.checkMobile);
},
methods: {
  // Método que verifica a largura da tela e define isMobile
  checkMobile() {
    this.isMobile = window.innerWidth <= 1279;
  },
  async loadEmails() {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error("User not authenticated");
      this.$router.push('/login');
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/gmail/emails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Failed to start Gmail Emails", err);
    }
  },
}
,
};
</script>



