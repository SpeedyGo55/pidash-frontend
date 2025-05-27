<template>
  <div class="bg-white shadow rounded-2xl p-4 flex flex-col items-center justify-center dark:bg-gray-800 dark:text-white">
    <h2 class="text-3xl font-semibold mb-2 text-center">{{ title }}</h2>
    <div class="w-full flex justify-center items-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['title'])
</script>
