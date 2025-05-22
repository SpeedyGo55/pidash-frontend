<template>
  <div class="w-full">
    <svg viewBox="0 0 100 10" class="">
      <rect x="0" y="0" width="100" height="10" fill="#e5e7eb" />
      <rect
        :x="0"
        :y="0"
        :width="(used / clampedTotal) * 100"
        height="10"
        fill="#4ade80"
      />
      <text
        x="50"
        y="7"
        text-anchor="middle"
        class="fill-gray-800 text-[5px] font-semibold"
      >
        {{ used }} / {{ clampedTotal }} {{ unit }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ used: Number, total: Number, unit: String })
const clampedUsed = computed(() => Math.min(parseInt(props.used), parseInt(props.total)))
const clampedTotal = computed(() => Math.max(parseInt(props.used), parseInt(props.total)))
const used = computed(() => clampedUsed.value)

</script>
