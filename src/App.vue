<template>
  <div class="h-full flex main-container">
    <!-- Sidebar -->
    <div v-show="sidebarOpen" class="w-64">
        <Sidebar/>
    </div>
    <!-- Content -->
    <div class="w-full rounded-l-2xl content-container">
        <RouterView />
    </div>
  </div>
</template>

<script>
import { RouterView } from 'vue-router';
import Sidebar from './components/Sidebar.vue'
import { supabase } from '../utils/supabase'

export default {
  components: {
    Sidebar,
    RouterView
  },
  data() {
    return {
        sidebarOpen: true,
        athletes: []
    }
  },
  watch: {},
  mounted() {
    this.getAthleteData();
  },
  methods: {
    async getAthleteData() {
            const { data } = await supabase.from('t_athlete').select('*');
            this.athletes = data;
            console.log(data);
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
