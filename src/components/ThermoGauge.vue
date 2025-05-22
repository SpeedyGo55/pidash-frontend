<template>
  <div class="relative w-12 h-40 border rounded-full bg-gray-200">
    <!-- Thermo Gauge -->
    <svg viewBox="0 0 100 200" class="absolute top-0 left-0">
      <rect x="20" y="0" width="60" height="200" fill="#e5e7eb" />
      <rect
        :x="20"
        :y="200 - height"
        width="60"
        :height="height"
        fill="#4ade80"
      />
      <text
        x="50"
        y="210"
        text-anchor="middle"
        class="fill-gray-800 text-[5px] font-semibold"
      >
        {{ clampedValue }} {{ unit }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ value: Number, max: Number, unit: String })
const clampedValue = computed(() => Math.min(props.value, props.max))
const height = computed(() => (clampedValue.value / props.max) * 100) // 0 to 100
</script>
