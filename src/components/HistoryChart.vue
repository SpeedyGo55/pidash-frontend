<template>
  <div class="w-full h-full dark:bg-gray-800 dark:text-white">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
<script setup lang="ts">
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
import { ref, watch, computed } from 'vue'
import { useDark } from '@vueuse/core'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, TimeScale, CategoryScale)

interface HistoryEntry {
  timestamp: string
  cpu_usage: number
  disk_used: number
  disk_total: number
  mem_used: number
  mem_total: number
}

const props = defineProps<{
  history: HistoryEntry[]
}>()

const isDark = useDark()

type ChartData = {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    borderColor: string
    fill: boolean
    tension: number
  }>
}

const chartData = ref<ChartData>({ labels: [], datasets: [] })

watch(
    () => props.history,
    (newHistory) => {
      chartData.value = {
        labels: newHistory.map((d) => {
          const dt = new Date(d.timestamp)
          return `${dt.getHours()}:${dt.getMinutes().toString().padStart(2, '0')}`
        }),
        datasets: [
          {
            label: 'CPU Usage (%)',
            data: newHistory.map((d) => parseFloat(d.cpu_usage.toFixed(2))),
            borderColor: isDark.value ? 'rgba(75,192,192,1)' : 'rgba(75,192,192,0.8)',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Disk Usage (%)',
            data: newHistory.map((d) =>
                parseFloat(((d.disk_used / d.disk_total) * 100).toFixed(2))
            ),
            borderColor: isDark.value ? 'rgba(153,102,255,1)' : 'rgba(54,162,235,1)',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Memory Usage (%)',
            data: newHistory.map((d) =>
                parseFloat(((d.mem_used / d.mem_total) * 100).toFixed(2))
            ),
            borderColor: isDark.value ? 'rgba(255,99,132,1)' : 'rgba(255,159,64,1)',
            fill: false,
            tension: 0.3
          }
        ]
      }
    },
    { immediate: true }
)

const maxValue = computed(() =>
    Math.max(
        ...props.history.map((d) =>
            Math.max(d.cpu_usage, (d.disk_used / d.disk_total) * 100, (d.mem_used / d.mem_total) * 100)
        )
    )
)

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: Math.round(maxValue.value * 1.1),
      title: { display: true, text: 'Usage (%)', color: isDark.value ? 'white' : 'black' },
      ticks: { color: isDark.value ? 'white' : 'black' }
    },
    x: {
      title: { display: true, text: 'Time', color: isDark.value ? 'white' : 'black' },
      ticks: { color: isDark.value ? 'white' : 'black' }
    }
  },
  plugins: { legend: { labels: { color: isDark.value ? 'white' : 'black' } } }
}))
</script>

<style scoped>
div {
  height: 300px;
}
</style>
