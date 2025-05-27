<template>
  <div class="w-full">
    <div class="bg-gray-200 h-4 rounded-full">
      <div
        class="bg-green-500 h-full rounded-full"
        :style="{ width: `${(used / clampedTotal) * 100}%`, transition: 'width 0.5s' }"
      ></div>
    </div>
    <div class="flex justify-between text-sm mt-1">
      <span>{{ used.toFixed(2) }} {{ unit }}</span>
      <span>{{ clampedTotal.toFixed(0) }} {{ unit }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  used: number
  total: number
  unit: string
}>()

const clampedTotal = computed(() => Math.max(props.used, props.total))
</script>

