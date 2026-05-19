<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function handleLogout() {
  await auth.logout()
  router.push('/')
}

const links = [
  { to: '/', icon: '🏠', text: 'Inicio' },
  { to: '/empleos', icon: '💼', text: 'Empleos' },
  { to: '/recursos', icon: '📚', text: 'Recursos' },
  { to: '/foro', icon: '💬', text: 'Foro' }
]
</script>

<template>
  <aside class="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 flex flex-col">
    <!-- Logo -->
    <div class="p-6 border-b border-slate-700">
      <router-link to="/" class="text-xl font-extrabold text-blue-400" style="font-family: 'Sora', sans-serif;">
        Portal<span class="text-emerald-400">Trabajos</span>
      </router-link>
    </div>

    <!-- Links -->
    <nav class="flex-1 p-4 space-y-1">
      <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="route.path === link.to ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition"
      >
        <span>{{ link.icon }}</span>
        {{ link.text }}
      </router-link>
    </nav>

    <!-- Usuario y logout -->
    <div class="p-4 border-t border-slate-700">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
          {{ auth.user?.nombres?.charAt(0) }}
        </div>
        <div>
          <div class="text-sm font-medium text-white">{{ auth.user?.nombres }}</div>
          <div class="text-xs text-slate-400 capitalize">{{ auth.user?.rol }}</div>
        </div>
      </div>
      <button @click="handleLogout" class="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition">
        🚪 Cerrar Sesión
      </button>
    </div>
  </aside>
</template>