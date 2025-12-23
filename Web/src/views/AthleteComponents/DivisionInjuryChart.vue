<template>
    <div class="chart-container">
        <apexchart type="bar" :height="height" :options="options" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
    name: 'DivisionInjuryChart',
    components: {
        apexchart: VueApexCharts
    },
    props: {
        divisionData: {
            type: Array,
            required: true,
            default: () => []
        },
        height: {
            type: Number,
            default: 350
        }
    },
    computed: {
        series() {
            return [
                {
                    name: 'Saudáveis',
                    data: this.divisionData.map(d => d.total_athletes - d.injured_athletes)
                },
                {
                    name: 'Lesionados',
                    data: this.divisionData.map(d => d.injured_athletes)
                },
                {
                    name: 'Registos de Lesões',
                    data: this.divisionData.map(d => d.total_injury_records)
                }
            ]
        },
        options() {
            return {
                chart: {
                    type: 'bar',
                    height: this.height,
                    stacked: true,
                    toolbar: { show: false }
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels: { position: 'center' },
                        borderRadius: 4
                    }
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '11px',
                        fontWeight: 600,
                        colors: ['#fff']
                    },
                    formatter: function (val, opt) {
                        const seriesName = opt.w.config.series[opt.seriesIndex].name
                        return `${val}`
                    }
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                xaxis: {
                    categories: this.divisionData.map(d => d.division),
                    title: { text: 'Quantidade' }
                },
                yaxis: {
                    title: { text: 'Escalão' }
                },
                tooltip: {
                    y: {
                        formatter: (val, { seriesIndex, w }) => {
                            return `${val}`
                        }
                    }
                },
                fill: { opacity: 1 },
                colors: ['#00E396', '#FF4560', '#FEB019'],
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetY: 5,
                    fontSize: '12px'
                }
            }
        }
    }
}
</script>

<style scoped>
.chart-container {
    width: 100%;
}
</style>