<template>
  <div class="w-full h-full flex p-2 gap-2 bg-gray-300">
    <Sidebar />
    <div class="flex-1 h-full overflow-y-auto">
      <div class="w-auto h-full rounded-2xl p-4 bg-white">
        <RouterView />
      </div>
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
