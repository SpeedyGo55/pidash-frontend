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
      <StatCard title="CPU History">
        <HistoryChart :history="historyData" />
      </StatCard>
    </div>
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import StatCard from './components/StatCard.vue'
import ThermoGauge from './components/ThermoGauge.vue'
import DialGauge from './components/DialGauge.vue'
import UsageBar from './components/UsageBar.vue'
import HistoryChart from "./components/HistoryChart.vue";
import { useDark } from '@vueuse/core'

const cpuTemp = ref(0)
const fanRpm = ref(0)
const uptime = ref(0)
const memUsed = ref(0)
const memTotal = ref(1)
const diskUsed = ref(0)
const diskTotal = ref(1)
const cpuUsage = ref(0)
const historyData = ref([])
const isDark = useDark().value

const uptimeText = computed(() => {
  const totalSeconds = uptime.value / 1000
  const d = Math.floor(totalSeconds / (3600 * 24))
  const h = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const m = Math.floor((totalSeconds % (3600 * 24) % 3600) / 60)
  return `${d}d ${h}h ${m}m`
})


async function fetchHistory() {
  try {
    const response = await axios.get('/history')
    historyData.value = response.data.data
    // sort history by timestamp
    historyData.value.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    // limit to last 24 hours
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    historyData.value = historyData.value.filter(item => new Date(item.timestamp) >= twentyFourHoursAgo)
    // convert timestamps to Date objects
    historyData.value.forEach(item => {
      item.timestamp = new Date(item.timestamp)
    })
  } catch (e) {
    console.error("Failed to fetch history:", e)
  }
}

async function fetchStats() {
  try {
    cpuTemp.value = (await axios.get('/cpu_temp')).data.cpu_temp
    fanRpm.value = (await axios.get('/fan_speed')).data.fan_speed
    uptime.value = (await axios.get('/uptime')).data.uptime

    const memStats = (await axios.get('/mem_usage')).data
    memUsed.value = parseInt(memStats.mem_used) / 1024 / 1024
    memTotal.value = parseInt(memStats.mem_total) / 1024 / 1024

    const diskStats = (await axios.get('/disk_usage')).data
    diskUsed.value = (parseInt(diskStats.used) / 1024 / 1024).toFixed(2)
    diskTotal.value = (parseInt(diskStats.total) / 1024 / 1024).toFixed(2)
    cpuUsage.value = ((await axios.get('/cpu_usage')).data.cpu_usage).toFixed(2)
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

