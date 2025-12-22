<template>
  <div class="division-injury-chart">
    <apexchart
      v-if="divisionData.length > 0"
      type="bar"
      height="450"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    <div v-else class="loading">
      Loading division statistics...
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import axios from 'axios'
import { safeGet } from '../../utils/utils'
import { divisionInjuryChartConfig } from '../../utils/chartUtils'

export default {
  name: 'DivisionInjuryChart',
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      divisionData: []
    }
  },
  computed: {
    series() {
      return divisionInjuryChartConfig.getSeries(this.divisionData)
    },
    chartOptions() {
      const divisions = this.divisionData.map(d => d.division)
      return divisionInjuryChartConfig.getChartOptions(divisions)
    }
  },
  methods: {
    async loadDivisionStats() {
      const response = await safeGet(
        axios.get('http://localhost:3000/aux/stats/athleteInjurySummary'),
        []
      );
      this.divisionData = response;
    }
  },
  mounted() {
    this.loadDivisionStats()
  }
}
</script>

<style scoped>
.division-injury-chart {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chart-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 14px;
}
</style>