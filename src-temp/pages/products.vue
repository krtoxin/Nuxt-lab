<template>
  <div class="px-4 py-6 space-y-6 bg-gradient-to-b from-gray-900 via-red-800 to-gray-900 text-white min-h-screen">
    <Head>
      <Title>Список продуктів</Title>
    </Head>

    <h1 class="text-4xl font-extrabold text-red-600 tracking-tight">Список продуктів</h1>

    <!-- Search -->
    <UInput
        v-model="search"
        placeholder="Пошук продуктів..."
        class="w-full bg-gray-800 text-white placeholder-gray-400 border-2 border-gray-600 rounded-xl py-3 px-6 text-lg shadow-lg focus:ring-4 focus:ring-red-500 transition"
    />

    <!-- Sort Controls -->
    <div class="flex flex-wrap gap-4 items-center">
      <label class="text-lg font-medium text-gray-300">Сортувати за:</label>
      <select
          v-model="sort.column"
          class="bg-gray-800 text-white border-2 border-gray-600 rounded-full px-4 py-2 focus:ring-4 focus:ring-red-500 transition shadow-lg"
      >
        <option value="title">Назва</option>
        <option value="price">Ціна</option>
        <option value="rating">Оцінка</option>
        <option value="brand">Бренд</option>
        <option value="category">Категорія</option>
      </select>

      <button
          @click="toggleSortDirection"
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition shadow-lg"
      >
        <!-- Use FontAwesome icons for arrows instead of emoji -->
        <i :class="sort.direction === 'asc' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
        <span>{{ sort.direction === 'asc' ? 'Зростання' : 'Спадання' }}</span>
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-700 shadow-lg bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900">
      <UTable
          :rows="paginatedProducts"
          :columns="columns"
          :loading="loading"
          sort-mode="manual"
          class="min-w-[1000px] bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 text-white shadow-xl"
      >
        <!-- Description -->
        <template #description-data="{ row }">
          <div class="description-clamp text-sm text-gray-300">
            {{ row.description }}
          </div>
        </template>

        <!-- Rating -->
        <template #rating-data="{ row }">
          <span :class="row.rating < 4.5 ? 'text-red-400' : 'text-green-400'">
            {{ row.rating.toFixed(1) }}
          </span>
        </template>

        <!-- Thumbnail -->
        <template #thumbnail-data="{ row }">
          <div class="flex justify-center">
            <img
                :src="row.thumbnail"
                :alt="`Фото продукту ${row.title}`"
                class="w-[100px] h-[100px] object-cover rounded shadow-md border border-gray-600"
                loading="lazy"
            />
          </div>
        </template>
      </UTable>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center border-t border-gray-700 pt-4">
      <UPagination
          v-model="page"
          :total="sortedFilteredProducts.length"
          :items-per-page="pageSize"
          class="bg-gradient-to-r from-red-600 to-red-500 rounded-lg shadow-xl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { DataTableColumns } from '#ui/types'

interface Product {
  id: number
  title: string
  description: string
  price: number
  rating: number
  brand: string
  category: string
  thumbnail: string
}

const products = ref<Product[]>([])
const loading = ref(false)
const search = ref('')
const page = ref(1)
const pageSize = 10

const sort = ref({
  column: 'title',
  direction: 'asc'
})

const toggleSortDirection = () => {
  sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
}

onMounted(async () => {
  try {
    loading.value = true
    const initial = await $fetch('https://dummyjson.com/products?limit=1')
    const total = initial.total || 100
    const limit = 30
    const result: Product[] = []

    for (let skip = 0; skip < total; skip += limit) {
      const res = await $fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
      if (res?.products) result.push(...res.products)
    }

    products.value = result
  } catch (err) {
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
})

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter((product) =>
      Object.values(product).some((val) =>
          String(val).toLowerCase().includes(search.value.toLowerCase())
      )
  )
})

const sortedFilteredProducts = computed(() => {
  const { column, direction } = sort.value
  const items = filteredProducts.value.slice()

  if (!column || !direction) return items

  return items.sort((a, b) => {
    const aVal = a[column as keyof Product]
    const bVal = b[column as keyof Product]

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    }

    return 0
  })
})

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * pageSize
  return sortedFilteredProducts.value.slice(start, start + pageSize)
})

watch([filteredProducts, sort], () => {
  page.value = 1
})

const columns: DataTableColumns<Product> = [
  { key: 'title', label: 'Назва' },
  {
    key: 'description',
    label: 'Опис',
    class: 'min-w-[250px] max-w-[400px] whitespace-normal'
  },
  { key: 'price', label: 'Ціна' },
  { key: 'rating', label: 'Оцінка' },
  { key: 'brand', label: 'Бренд' },
  { key: 'category', label: 'Категорія' },
  { key: 'thumbnail', label: 'Фото' }
]
</script>

<style scoped>
/* Import FontAwesome icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

/* Carbon-fiber background pattern */
body {
  background: #121212;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.8) 1px, transparent 1px),
  radial-gradient(circle, rgba(0, 0, 0, 0.8) 1px, transparent 1px);
  background-size: 20px 20px;
}

.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4rem;
  max-height: calc(1.4rem * 2);
}

.bg-gray-900 {
  background-color: #121212;
}

.text-white {
  color: #e0e0e0;
}

.bg-gray-800 {
  background-color: #1e1e1e;
}

.text-gray-300 {
  color: #d1d1d1;
}

.text-red-600 {
  color: #ff4c4c;
}

.text-green-400 {
  color: #4caf50;
}

.text-blue-500 {
  color: #1e90ff;
}

.border-gray-700 {
  border-color: #333333;
}

button:hover {
  transition: all 0.3s ease-in-out;
}

input:focus, select:focus, button:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(255, 76, 76, 0.8); /* Red glow effect */
}
</style>
