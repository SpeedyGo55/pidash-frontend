<template>
  <div class="w-full">
    <div class="bg-gray-200 h-4 rounded-full">
      <div
        class="bg-green-500 h-full rounded-full"
        :style="{ width: `${(used / clampedTotal) * 100}%`, transition: 'width 0.5s' }"
      ></div>
    </div>
    <div class="flex justify-between text-sm mt-1">
      <span>{{ used }} {{ unit }}</span>
      <span>{{ clampedTotal }} {{ unit }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ used: Number, total: Number, unit: String })
const clampedUsed = computed(() => Math.min(parseInt(props.used), parseInt(props.total)))
const clampedTotal = computed(() => Math.max(parseInt(props.used), parseInt(props.total)))
const used = computed(() => clampedUsed.value)

</script>
