<!-- components/HistoryChart.vue -->
<template>
  <div class="w-full h-full dark:bg-gray-800 dark:text-white">
    <Line :data="chartData" :options="chartOptions" class="dark:text-white"/>
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
import {computed, onMounted} from 'vue'
import { useDark } from '@vueuse/core'

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
        borderColor: useDark().value ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 0.8)',
        tension: 0.3
      },
      {
        label: 'Disk Usage (%)',
        data: props.history.map(d => (d.disk_used / d.disk_total * 100).toFixed(2)),
        fill: false,
        borderColor: useDark().value ? 'rgba(153, 102, 255, 1)' : 'rgba(54, 162, 235, 1)',
        tension: 0.3
      },
      {
        label: 'Memory Usage (%)',
        data: props.history.map(d => (d.mem_used / d.mem_total * 100).toFixed(2)),
        fill: false,
        borderColor: useDark().value ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 159, 64, 1)',
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
        text: 'Usage (%)',
        fontColor: useDark().value ? 'white' : 'black'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Time',
        fontColor: useDark().value ? 'white' : 'black'

      }
    }
  },
  legend: {
    display: true,
    position: 'top',
    fontColor: useDark().value ? 'white' : 'black'

  },
}
</script>

<style scoped>
div {
  height: 300px;
}
</style>
