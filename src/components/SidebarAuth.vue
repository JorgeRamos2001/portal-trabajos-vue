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

const linksPublicos = [
  { to: '/', icon: '🏠', text: 'Inicio' },
  { to: '/empleos', icon: '💼', text: 'Empleos' },
  { to: '/recursos', icon: '📚', text: 'Recursos' },
  { to: '/foro', icon: '💬', text: 'Foro' }
]

const linksPostulante = [
  { to: '/mis-postulaciones', icon: '📋', text: 'Mis postulaciones' },
  { to: '/mi-perfil', icon: '👤', text: 'Mi Perfil / CV' }
]

const linksEmpleador = [
  { to: '/mis-empleos', icon: '📝', text: 'Mis ofertas' },
  { to: '/aplicaciones', icon: '👥', text: 'Aplicaciones' },
  { to: '/publicar-empleo', icon: '➕', text: 'Publicar empleo' },
  { to: '/mi-perfil-empresa', icon: '🏢', text: 'Perfil empresa' }
]

const linksAdmin = [
  { to: '/admin', icon: '📊', text: 'Dashboard' },
  { to: '/admin/usuarios', icon: '👥', text: 'Usuarios' },
  { to: '/admin/empleos', icon: '💼', text: 'Empleos' },
  { to: '/admin/recursos', icon: '📚', text: 'Recursos' },
  { to: '/admin/foro', icon: '💬', text: 'Foro' }
]

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <aside class="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 flex flex-col z-50">

    <!-- Logo -->
    <div class="p-5 border-b border-slate-700/50">
      <router-link to="/" class="text-xl font-extrabold text-blue-400 no-underline" style="font-family: 'Sora', sans-serif;">
        Portal<span class="text-emerald-400">Trabajos</span>
      </router-link>
      <div v-if="auth.user?.rol === 'admin'" class="bg-red-500/20 text-red-300 rounded-md px-2 py-0.5 text-xs font-bold mt-1.5 inline-block" style="font-family: 'Sora', sans-serif;">
        🛡️ Panel Administrador
      </div>
      <div v-else-if="auth.user?.rol === 'empleador'" class="bg-blue-500/20 text-blue-300 rounded-md px-2 py-0.5 text-xs font-bold mt-1.5 inline-block" style="font-family: 'Sora', sans-serif;">
        🏢 Portal Empleador
      </div>
      <div v-else class="text-slate-400 text-xs mt-1.5">Portal de candidato</div>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">

      <!-- General -->
      <p class="text-xs text-slate-500 uppercase tracking-wider px-3 py-2 font-semibold" style="font-family: 'Sora', sans-serif;">General</p>
      <router-link v-for="link in linksPublicos" :key="link.to" :to="link.to"
                   :class="isActive(link.to) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition no-underline">
        <span class="w-5 text-center">{{ link.icon }}</span> {{ link.text }}
      </router-link>

      <!-- Postulante -->
      <template v-if="auth.user?.rol === 'postulante'">
        <p class="text-xs text-slate-500 uppercase tracking-wider px-3 py-2 mt-3 font-semibold" style="font-family: 'Sora', sans-serif;">Candidato</p>
        <router-link v-for="link in linksPostulante" :key="link.to" :to="link.to"
                     :class="isActive(link.to) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
                     class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition no-underline">
          <span class="w-5 text-center">{{ link.icon }}</span> {{ link.text }}
        </router-link>
      </template>

      <!-- Empleador -->
      <template v-if="auth.user?.rol === 'empleador'">
        <p class="text-xs text-slate-500 uppercase tracking-wider px-3 py-2 mt-3 font-semibold" style="font-family: 'Sora', sans-serif;">Empleador</p>
        <router-link v-for="link in linksEmpleador" :key="link.to" :to="link.to"
                     :class="isActive(link.to) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
                     class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition no-underline">
          <span class="w-5 text-center">{{ link.icon }}</span> {{ link.text }}
        </router-link>
      </template>

      <!-- Admin -->
      <template v-if="auth.user?.rol === 'admin'">
        <p class="text-xs text-slate-500 uppercase tracking-wider px-3 py-2 mt-3 font-semibold" style="font-family: 'Sora', sans-serif;">Administración</p>
        <router-link v-for="link in linksAdmin" :key="link.to" :to="link.to"
                     :class="isActive(link.to) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
                     class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition no-underline">
          <span class="w-5 text-center">{{ link.icon }}</span> {{ link.text }}
        </router-link>
      </template>

    </nav>

    <!-- Footer usuario -->
    <div class="p-4 border-t border-slate-700/50">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
             :class="auth.user?.rol === 'admin' ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-blue-600 to-emerald-500'">
          {{ auth.user?.nombres?.charAt(0) || '?' }}
        </div>
        <div class="min-w-0">
          <div class="text-sm font-medium text-white truncate">{{ auth.user?.nombres }}</div>
          <div class="text-xs text-slate-400 capitalize">{{ auth.user?.rol }}</div>
        </div>
      </div>
      <button @click="handleLogout" class="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition">
        🚪 Cerrar Sesión
      </button>
    </div>

  </aside>
</template>