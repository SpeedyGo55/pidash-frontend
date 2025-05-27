<template>
  <div class="w-full max-w-[180px] aspect-[2/1] relative">
    <svg viewBox="0 0 200 100">
      <!-- Background arc -->
      <path d="M20,100 A80,80 0 0,1 180,100" stroke="#e5e7eb" stroke-width="30" fill="none"/>

      <!-- Foreground arc with animated value on initial mount -->
      <path
          :d="arcPath"
          stroke="#4ade80"
          stroke-width="30"
          fill="none"
          stroke-linecap="round"
      />

      <!-- Label -->
      <text x="100" y="90" text-anchor="middle" class="fill-gray-800 dark:fill-white font-semibold text-xl">
        {{ Math.round(animatedValue) }} {{ unit }}
      </text>
    </svg>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue'

const props = defineProps<{
  value: number
  max: number
  unit: string
}>()

const clampedValue = computed(() => Math.min(props.value, props.max))
const clampedMax = computed(() => Math.max(props.value, props.max))
const animatedValue = ref<number>(0)

function animateValue(start: number, end: number) {
  const duration = 1000
  const startTime = performance.now()

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    animatedValue.value = start + (end - start) * progress
    if (progress < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  animatedValue.value = clampedValue.value
  animateValue(0, clampedValue.value)
})

watch(
    () => props.value,
    (newVal) => {
      animateValue(animatedValue.value, Math.min(newVal, clampedMax.value))
    }
)

watch(
    () => props.max,
    () => {
      animateValue(animatedValue.value, clampedValue.value)
    }
)

const angle = computed(() => (animatedValue.value / props.max) * Math.PI)
const radius = 80
const center = 100

const arcPath = computed(() => {
  const endAngle = angle.value
  const x = center + radius * Math.cos(Math.PI - endAngle)
  const y = center - radius * Math.sin(Math.PI - endAngle)
  return `M20,100 A80,80 0 ${endAngle > Math.PI ? 1 : 0},1 ${x},${y}`
})
</script>
