<template>
  <div class="h-full flex main-container">
    <!-- Sidebar -->
    <div v-show="sidebarOpen" class="w-64">
      <Sidebar />
    </div>
    <!-- Content -->
    <div class="w-full flex flex-col rounded-l-2xl content-container p-9 overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>

<script>
import { RouterView } from 'vue-router';
import Sidebar from './components/Sidebar.vue'

export default {
  components: {
    Sidebar,
    RouterView
  },
  data() {
    return {
      sidebarOpen: true,
    }
  },
  watch: {},
  mounted() {
  },
  methods: {

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
