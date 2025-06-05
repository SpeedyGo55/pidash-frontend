<template>
  <div class="min-h-screen bg-gray-100 p-4 dark:bg-gray-900">
    <h1 class="text-3xl font-bold mb-6 text-center dark:text-white">PiDash</h1>

    <div class="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">

      <StatCard title="Uptime" >
        <div class="text-xl font-semibold text-center">
          {{ uptimeText }}
        </div>
      </StatCard>

      <StatCard title="CPU Temp">
        <ThermoGauge :value="cpuTemp" :max="90" unit="°C" />
      </StatCard>

      <StatCard title="CPU Usage">
        <DialGauge :value="cpuUsage" :max="100" unit="%" />
      </StatCard>

      <StatCard title="Fan RPM">
        <DialGauge :value="fanRpm" :max="8000" unit="RPM" />
      </StatCard>

      <StatCard title="Memory Usage">
        <UsageBar :used="memUsed" :total="memTotal" unit="GB" />
      </StatCard>

      <StatCard title="Disk Usage">
        <UsageBar :used="diskUsed" :total="diskTotal" unit="GB" />
      </StatCard>

    </div>
    <div class="container mx-auto mt-6">
      <StatCard title="History">
        <HistoryChart :history="historyData" />
      </StatCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import StatCard from './components/StatCard.vue'
import ThermoGauge from './components/ThermoGauge.vue'
import DialGauge from './components/DialGauge.vue'
import UsageBar from './components/UsageBar.vue'
import HistoryChart from "./components/HistoryChart.vue"

interface HistoryEntry {
  timestamp: string
  cpu_usage: number
  disk_used: number
  disk_total: number
  mem_used: number
  mem_total: number
}

const cpuTemp = ref<number>(0)
const fanRpm = ref<number>(0)
const uptime = ref<number>(0)
const memUsed = ref<number>(0)
const memTotal = ref<number>(1)
const diskUsed = ref<number>(0)
const diskTotal = ref<number>(1)
const cpuUsage = ref<number>(0)
const historyData = ref<HistoryEntry[]>([])

const uptimeText = computed(() => {
  const totalSeconds = uptime.value / 1000
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  return `${d}d ${h}h ${m}m`
})

async function fetchHistory() {
  try {
    const response = (await axios.get<{ data: HistoryEntry[] }>('/history')).data.data
    historyData.value = response
    historyData.value.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    historyData.value.forEach(entry => {
      entry.timestamp = entry.timestamp + 'Z' // Ensure timestamp is in UTC format
    })
    // pad missing entries
    const now = new Date()
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 hours ago
    const paddedHistory: HistoryEntry[] = []
    for (let time = startTime; time <= now; time.setMinutes(time.getMinutes() + 1)) {
      const entry = historyData.value.find(e => new Date(e.timestamp).getMinutes() === time.getMinutes() &&
        new Date(e.timestamp).getHours() === time.getHours() &&
        new Date(e.timestamp).getDate() === time.getDate() &&
        new Date(e.timestamp).getMonth() === time.getMonth() &&
        new Date(e.timestamp).getFullYear() === time.getFullYear())
      if (entry) {
        paddedHistory.push(entry)
      } else {
        paddedHistory.push({
          timestamp: time.toISOString(),
          cpu_usage: 0,
          disk_used: 0,
          disk_total: 1,
          mem_used: 0,
          mem_total: 1
        })
      }
    }
    historyData.value = paddedHistory
    historyData.value.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    historyData.value = historyData.value.slice(-100) // Keep only the last 24 hours of data
  } catch (e) {
    console.error("Failed to fetch history:", e)
  }
}

async function fetchStats() {
  try {
    cpuTemp.value = (await axios.get<{ cpu_temp: number }>('/cpu_temp')).data.cpu_temp
    fanRpm.value = (await axios.get<{ fan_speed: number }>('/fan_speed')).data.fan_speed
    uptime.value = (await axios.get<{ uptime: number }>('/uptime')).data.uptime

    const memStats = (await axios.get<{ mem_used: number; mem_total: number }>('/mem_usage')).data
    memUsed.value = memStats.mem_used / 1024 / 1024
    memTotal.value = memStats.mem_total / 1024 / 1024

    const diskStats = (await axios.get<{ used: number; total: number }>('/disk_usage')).data
    diskUsed.value = parseFloat((diskStats.used / 1024 / 1024).toFixed(2))
    diskTotal.value = parseFloat((diskStats.total / 1024 / 1024).toFixed(2))

    cpuUsage.value = parseFloat(((await axios.get<{ cpu_usage: number }>('/cpu_usage')).data.cpu_usage).toFixed(2))
  } catch (e) {
    console.error("Failed to fetch stats:", e)
  }
}

onMounted(() => {
  fetchStats()
  fetchHistory()
  setInterval(() => {
    fetchStats()
    fetchHistory()
  }, 1000)
})
</script>