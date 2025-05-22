<template>
  <div class="w-full max-w-[180px] aspect-[2/1] relative">
    <svg viewBox="0 0 200 100">
      <!-- Background arc -->
      <path d="M20,100 A80,80 0 0,1 180,100" stroke="#e5e7eb" stroke-width="30" fill="none"/>

      <!-- Foreground arc -->
      <path
          :d="arcPath"
          stroke="#4ade80"
          stroke-width="30"
          fill="none"
      />
      <!-- Label -->
      <text x="100" y="100" text-anchor="middle" class="fill-gray-800 text-xl font-semibold">
        {{ value }} {{ unit }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: Number,
  max: Number,
  unit: String
})

const clampedValue = computed(() => Math.min(props.value, props.max))
const angle = computed(() => (clampedValue.value / props.max) * Math.PI) // 0 to PI

const radius = 80
const center = 100

const arcPath = computed(() => {
  const endAngle = angle.value
  const x = center + radius * Math.cos(Math.PI - endAngle)
  const y = center - radius * Math.sin(Math.PI - endAngle)
  return `M20,100 A80,80 0 ${endAngle > Math.PI ? 1 : 0},1 ${x},${y}`
})
</script>
