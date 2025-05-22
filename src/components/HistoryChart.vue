<!-- components/HistoryChart.vue -->
<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, TimeScale, CategoryScale)

const props = defineProps({
  history: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => {
  return {
    labels: props.history.map(d => new Date(d.timestamp).getHours() + ':' + new Date(d.timestamp).getMinutes().toString().padStart(2, '0')),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: props.history.map(d => (d.cpu_usage).toFixed(2)),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.3
      },
      {
        label: 'Disk Usage (%)',
        data: props.history.map(d => (d.disk_used / d.disk_total * 100).toFixed(2)),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.3
      },
      {
        label: 'Memory Usage (%)',
        data: props.history.map(d => (d.mem_used / d.mem_total * 100).toFixed(2)),
        fill: false,
        borderColor: 'rgba(255, 159, 64, 1)',
        tension: 0.3
      }

    ]
  }
})
const maxValue = computed(() => {
  return Math.max(
    ...props.history.map(d => Math.max(d.cpu_usage, d.disk_used / d.disk_total * 100, d.mem_used / d.mem_total * 100))
  )
})
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: Math.round(maxValue.value*1.1),
      title: {
        display: true,
        text: 'Usage (%)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Time'
      }
    }
  }
}
</script>

<style scoped>
div {
  height: 300px;
}
</style>
