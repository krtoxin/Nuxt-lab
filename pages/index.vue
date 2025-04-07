<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-red-800 to-gray-900">
    <NuxtLink
        to="/products"
        class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-xl rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-red-700 hover:to-red-600 transition"
    >
      Список продуктів
    </NuxtLink>
  </div>
</template>

<script setup>
</script>

<style scoped>
body {
  background: #121212;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.8) 1px, transparent 1px),
  radial-gradient(circle, rgba(0, 0, 0, 0.8) 1px, transparent 1px);
  background-size: 20px 20px;
}

.bg-gradient-to-b {
  background: linear-gradient(to bottom, #121212, #7b0000);
}

a {
  text-decoration: none;
}

a:hover {
  box-shadow: 0 0 10px rgba(255, 76, 76, 0.8);
  background: linear-gradient(to right, #f44336, #d32f2f);
}
</style>
