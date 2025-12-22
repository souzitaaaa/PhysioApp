<template>
    <div class="w-full flex justify-center">
        <apexchart v-if="chartData && series.length > 0" type="pie" :height="height" :options="chartOptions"
            :series="series" />
        <div v-else class="flex items-center justify-center" :style="{ height: height + 'px' }">
            <i class="fa-solid fa-spinner fa-spin text-gray-400 text-2xl"></i>
        </div>
    </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
    name: 'HealthPieChart',
    components: { apexchart: VueApexCharts },
    props: {
        chartData: { type: Object, default: null },
        height: { type: Number, default: 250 }
    },
    computed: {
        series() {
            if (!this.chartData) return []
            return [
                Number(this.chartData.healthy_athletes) || 0,
                Number(this.chartData.injured_athletes) || 0
            ]
        },
        chartOptions() {
            return {
                chart: {
                    type: 'pie',
                    height: this.height,
                    toolbar: { show: false },
                    foreColor: "#4B5563"
                },
                labels: ['Saudáveis', 'Lesionados'],
                colors: ['#22C55E', '#EF4444'],
                dataLabels: { enabled: false },
                legend: {
                    show: true,
                    position: 'bottom',
                    horizontalAlign: 'center',
                    fontSize: '14px',
                    labels: { useSeriesColors: false }
                },
                tooltip: {
                    y: {
                        formatter: (val, opts) => {
                            const totals = opts?.w?.globals?.seriesTotals || opts?.globals?.seriesTotals
                            if (!totals) return val

                            const total = totals.reduce((a, b) => a + b, 0)
                            const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : 0
                            return `${val} atletas (${percentage}%)`
                        }
                    }
                },
                responsive: [
                    {
                        breakpoint: 640,
                        options: { chart: { height: 200 }, legend: { position: 'bottom' } }
                    }
                ]
            }
        }
    }
}
</script>

<style scoped>
.apexcharts-canvas:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}
</style>
