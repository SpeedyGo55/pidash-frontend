<template>
  <div class="relative w-12 h-40 border rounded-full bg-gray">
    <!-- Thermo Gauge -->
    <div
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-500 rounded-full"
      :style="{ height: height + '%', width: '100%', transition: 'height 0.5s' }"
    ></div>
    <!-- Label -->
    <div
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center text-gray-800 font-semibold"
      :style="{ bottom: text_height + '%', transition: 'bottom 0.5s' }"
    >
      {{ clampedValue }} {{ unit }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ value: Number, max: Number, unit: String })
const clampedValue = computed(() => Math.min(props.value / 1000, props.max))
const height = computed(() => (clampedValue.value / props.max) * 100) // 0 to 100
const text_height = computed(() => Math.min(height.value, 70)) // 0 to 100
</script>
