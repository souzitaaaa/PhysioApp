<template>
    <div class="w-full flex justify-center">
        <div class="w-full">
            <apexchart v-if="chartData && series.length > 0" type="line" :height="'100%'" :options="chartOptions"
                :series="series" />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
                <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
            </div>
        </div>
    </div>
</template>


<script>
import VueApexCharts from "vue3-apexcharts";

export default {
    name: "MonthlyInjuriesChart",
    components: { apexchart: VueApexCharts },
    props: {
        chartData: { type: Array, default: () => [] },
        height: { type: Number, default: 300 },
    },
    computed: {
        series() {
            if (!this.chartData || this.chartData.length === 0) return [];
            return [
                {
                    name: "Novas Lesões",
                    data: this.chartData.map((item) => Number(item.new_injuries) || 0),
                },
            ];
        },
        categories() {
            return this.chartData.map((item) => item.month_name.trim());
        },
        chartOptions() {
            return {
                chart: {
                    type: "line",
                    height: this.height,
                    toolbar: { show: false },
                    zoom: { enabled: false },
                    foreColor: "#4B5563",
                },
                colors: ["#22333B"],
                stroke: { curve: "smooth", width: 3 },
                markers: { size: 4, hover: { size: 6 } },
                dataLabels: { enabled: false },
                xaxis: {
                    categories: this.categories,
                    labels: {
                        rotate: -45,
                        style: { fontSize: "12px" },
                        formatter: function (val, index) {
                            return index % 2 === 0 ? val : "";
                        },
                    },
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                },
                tooltip: { // always show the month
                    enabled: false
                },
                grid: {
                    borderColor: "#E5E7EB",
                    row: { colors: ["#F9FAFB", "transparent"], opacity: 0.5 },
                },
            };
        },
    },


};
</script>

<style scoped>
.apexcharts-canvas:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}
</style>
